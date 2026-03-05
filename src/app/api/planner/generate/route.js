import { NextResponse } from 'next/server';
import { generatePlan } from '@/lib/utils/planGenerator';
import { getCropById } from '@/lib/data/crops';
import { UNITS } from '@/lib/data/units';
import { authenticateRequest } from '@/lib/auth/middleware';

// ─── POST /api/planner/generate ───────────────────────────────────────────────
// Receives farmer's form inputs, validates them, generates and returns a plan.
// Requires authentication — only logged-in farmers can generate plans.
// No database saving yet — just generate and return.

export async function POST(request) {
  try {

    // ── Auth check ────────────────────────────────────────────────────────────
    // Any logged-in user can generate a plan — no role restriction.
    const authUser = await authenticateRequest(request);
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized — please log in to generate a plan' },
        { status: 401 }
      );
    }

    // ── Parse request body ────────────────────────────────────────────────────
    const body = await request.json();
    const { cropId, landSize, landUnit, landCondition, soilType, plantingDate, district, upazila } = body;


    // ── Validate required fields ──────────────────────────────────────────────
    const missing = [];
    if (!cropId)        missing.push('cropId');
    if (!landSize)      missing.push('landSize');
    if (!landUnit)      missing.push('landUnit');
    if (!landCondition) missing.push('landCondition');
    if (!soilType)      missing.push('soilType');
    if (!plantingDate)  missing.push('plantingDate');
    if (!district)      missing.push('district');

    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    // ── Validate crop exists ──────────────────────────────────────────────────
    const crop = getCropById(cropId);
    if (!crop) {
      return NextResponse.json(
        { error: `Invalid crop: ${cropId}` },
        { status: 400 }
      );
    }

    // ── Validate land unit ────────────────────────────────────────────────────
    const validUnits = Object.values(UNITS);
    if (!validUnits.includes(landUnit)) {
      return NextResponse.json(
        { error: `Invalid land unit. Must be one of: ${validUnits.join(', ')}` },
        { status: 400 }
      );
    }

    // ── Validate land size ────────────────────────────────────────────────────
    const parsedSize = parseFloat(landSize);
    if (isNaN(parsedSize) || parsedSize <= 0) {
      return NextResponse.json(
        { error: 'Land size must be a positive number' },
        { status: 400 }
      );
    }

    // ── Validate land condition ───────────────────────────────────────────────
    const validConditions = ['fertile', 'average', 'poor'];
    if (!validConditions.includes(landCondition)) {
      return NextResponse.json(
        { error: `Invalid land condition. Must be one of: ${validConditions.join(', ')}` },
        { status: 400 }
      );
    }

    // ── Validate soil type ────────────────────────────────────────────────────
    const validSoils = ['loamy', 'clay', 'sandy', 'silt'];
    if (!validSoils.includes(soilType)) {
      return NextResponse.json(
        { error: `Invalid soil type. Must be one of: ${validSoils.join(', ')}` },
        { status: 400 }
      );
    }

    // ── Validate planting date ────────────────────────────────────────────────
    const date = new Date(plantingDate);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: 'Invalid planting date' },
        { status: 400 }
      );
    }

    // Don't allow planting dates more than 1 year in the past
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    if (date < oneYearAgo) {
      return NextResponse.json(
        { error: 'Planting date cannot be more than 1 year in the past' },
        { status: 400 }
      );
    }


    // ── Generate the plan ─────────────────────────────────────────────────────
    const plan = generatePlan({
      cropId,
      landSize:      parsedSize,
      landUnit,
      landCondition,
      soilType,
      plantingDate,
      district,
      upazila:       upazila || '',
    });


    // ── Return the plan ───────────────────────────────────────────────────────
    return NextResponse.json({
      success: true,
      plan,
    });

  } catch (error) {
    console.error('Plan generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate plan. Please try again.' },
      { status: 500 }
    );
  }
}