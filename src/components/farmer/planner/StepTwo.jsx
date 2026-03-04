'use client';

import { useState } from 'react';
import { MapPin, ChevronRight, ChevronLeft, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LOCATIONS = {
  'Dhaka': {
    districts: {
      'Dhaka':       ['Dhanmondi', 'Mirpur', 'Uttara', 'Mohammadpur', 'Tejgaon', 'Savar', 'Keraniganj'],
      'Gazipur':     ['Gazipur Sadar', 'Kaliakair', 'Kapasia', 'Sreepur', 'Kaliganj'],
      'Manikganj':   ['Manikganj Sadar', 'Singair', 'Shibalaya', 'Saturia', 'Ghior'],
      'Munshiganj':  ['Munshiganj Sadar', 'Srinagar', 'Sirajdikhan', 'Louhajang', 'Tongibari'],
      'Narsingdi':   ['Narsingdi Sadar', 'Palash', 'Shibpur', 'Belabo', 'Raipura'],
      'Narayanganj': ['Narayanganj Sadar', 'Araihazar', 'Sonargaon', 'Rupganj', 'Bandar'],
      'Faridpur':    ['Faridpur Sadar', 'Bhanga', 'Saltha', 'Nagarkanda', 'Boalmari'],
      'Gopalganj':   ['Gopalganj Sadar', 'Kashiani', 'Kotalipara', 'Muksudpur', 'Tungipara'],
      'Madaripur':   ['Madaripur Sadar', 'Shibchar', 'Kalkini', 'Rajoir'],
      'Rajbari':     ['Rajbari Sadar', 'Goalanda', 'Pangsha', 'Baliakandi', 'Kalukhali'],
      'Shariatpur':  ['Shariatpur Sadar', 'Naria', 'Zanjira', 'Gosairhat', 'Damudya'],
      'Tangail':     ['Tangail Sadar', 'Kalihati', 'Sakhipur', 'Mirzapur', 'Ghatail', 'Basail'],
      'Kishoreganj': ['Kishoreganj Sadar', 'Bhairab', 'Kuliarchar', 'Bajitpur', 'Itna'],
    }
  },
  'Chittagong': {
    districts: {
      'Chittagong':      ['Chittagong Sadar', 'Hathazari', 'Raozan', 'Sitakunda', 'Mirsarai', 'Patiya', 'Anwara'],
      "Cox's Bazar":     ["Cox's Bazar Sadar", 'Teknaf', 'Ukhiya', 'Ramu', 'Chakaria', 'Pekua'],
      'Comilla':         ['Comilla Sadar', 'Daudkandi', 'Chandina', 'Muradnagar', 'Brahmanpara', 'Laksam'],
      'Feni':            ['Feni Sadar', 'Chhagalnaiya', 'Daganbhuiyan', 'Parshuram', 'Sonagazi'],
      'Brahmanbaria':    ['Brahmanbaria Sadar', 'Kasba', 'Nabinagar', 'Sarail', 'Ashuganj', 'Akhaura'],
      'Chandpur':        ['Chandpur Sadar', 'Hajiganj', 'Kachua', 'Matlab Uttar', 'Matlab Dakshin'],
      'Lakshmipur':      ['Lakshmipur Sadar', 'Raipur', 'Ramganj', 'Ramgati', 'Kamalnagar'],
      'Noakhali':        ['Noakhali Sadar', 'Begumganj', 'Hatiya', 'Subarnachar', 'Companiganj'],
      'Khagrachhari':    ['Khagrachhari Sadar', 'Dighinala', 'Panchhari', 'Mahalchhari', 'Manikchhari'],
      'Rangamati':       ['Rangamati Sadar', 'Kaptai', 'Kawkhali', 'Bagaichhari', 'Barkal'],
      'Bandarban':       ['Bandarban Sadar', 'Alikadam', 'Naikhongchhari', 'Rowangchhari', 'Thanchi'],
    }
  },
  'Rajshahi': {
    districts: {
      'Rajshahi':          ['Rajshahi Sadar', 'Paba', 'Godagari', 'Tanore', 'Mohanpur', 'Bagha', 'Charghat'],
      'Bogura':            ['Bogura Sadar', 'Shibganj', 'Gabtali', 'Sherpur', 'Nandigram', 'Kahalu'],
      'Chapainawabganj':   ['Chapainawabganj Sadar', 'Shibganj', 'Gomastapur', 'Nachole', 'Bholahat'],
      'Joypurhat':         ['Joypurhat Sadar', 'Akkelpur', 'Kalai', 'Khetlal', 'Panchbibi'],
      'Naogaon':           ['Naogaon Sadar', 'Atrai', 'Raninagar', 'Manda', 'Niamatpur', 'Badalgachhi'],
      'Natore':            ['Natore Sadar', 'Baraigram', 'Gurudaspur', 'Lalpur', 'Singra'],
      'Pabna':             ['Pabna Sadar', 'Ishwardi', 'Atgharia', 'Bera', 'Bhangura', 'Chatmohar'],
      'Sirajganj':         ['Sirajganj Sadar', 'Ullapara', 'Shahjadpur', 'Kazipur', 'Belkuchi', 'Raiganj'],
    }
  },
  'Khulna': {
    districts: {
      'Khulna':    ['Khulna Sadar', 'Dumuria', 'Batiaghata', 'Dacope', 'Paikgachha', 'Koyra'],
      'Bagerhat':  ['Bagerhat Sadar', 'Mongla', 'Fakirhat', 'Mollahat', 'Kachua', 'Morrelganj'],
      'Satkhira':  ['Satkhira Sadar', 'Assasuni', 'Debhata', 'Kalaroa', 'Kaliganj', 'Shyamnagar'],
      'Jessore':   ['Jessore Sadar', 'Abhaynagar', 'Bagherpara', 'Chaugachha', 'Jhikargacha', 'Manirampur'],
      'Jhenaidah': ['Jhenaidah Sadar', 'Harinakunda', 'Kaliganj', 'Kotchandpur', 'Maheshpur', 'Shailkupa'],
      'Kushtia':   ['Kushtia Sadar', 'Kumarkhali', 'Khoksa', 'Mirpur', 'Daulatpur', 'Bheramara'],
      'Magura':    ['Magura Sadar', 'Mohammadpur', 'Shalikha', 'Sreepur'],
      'Meherpur':  ['Meherpur Sadar', 'Gangni', 'Mujibnagar'],
      'Narail':    ['Narail Sadar', 'Lohagara', 'Kalia'],
    }
  },
  'Barishal': {
    districts: {
      'Barishal':   ['Barishal Sadar', 'Agailjhara', 'Babuganj', 'Bakerganj', 'Banaripara', 'Gaurnadi', 'Hizla'],
      'Bhola':      ['Bhola Sadar', 'Burhanuddin', 'Char Fasson', 'Daulatkhan', 'Lalmohan', 'Manpura'],
      'Jhalokati':  ['Jhalokati Sadar', 'Kathalia', 'Nalchity', 'Rajapur'],
      'Patuakhali': ['Patuakhali Sadar', 'Bauphal', 'Dashmina', 'Galachipa', 'Kalapara', 'Mirzaganj'],
      'Pirojpur':   ['Pirojpur Sadar', 'Bhandaria', 'Kawkhali', 'Mathbaria', 'Nazirpur', 'Nesarabad'],
      'Barguna':    ['Barguna Sadar', 'Amtali', 'Bamna', 'Betagi', 'Patharghata', 'Taltali'],
    }
  },
  'Sylhet': {
    districts: {
      'Sylhet':      ['Sylhet Sadar', 'Beanibazar', 'Bishwanath', 'Companiganj', 'Fenchuganj', 'Golapganj', 'Jaintiapur'],
      'Moulvibazar': ['Moulvibazar Sadar', 'Barlekha', 'Juri', 'Kamalganj', 'Kulaura', 'Rajnagar', 'Sreemangal'],
      'Habiganj':    ['Habiganj Sadar', 'Ajmiriganj', 'Baniachong', 'Bahubal', 'Chunarughat', 'Lakhai', 'Madhabpur', 'Nabiganj'],
      'Sunamganj':   ['Sunamganj Sadar', 'Bishwamvarpur', 'Chhatak', 'Derai', 'Dharampasha', 'Dowarabazar', 'Jagannathpur', 'Jamalganj'],
    }
  },
  'Rangpur': {
    districts: {
      'Rangpur':     ['Rangpur Sadar', 'Badarganj', 'Gangachara', 'Kaunia', 'Mithapukur', 'Pirgachha', 'Pirganj', 'Taraganj'],
      'Dinajpur':    ['Dinajpur Sadar', 'Birampur', 'Birganj', 'Biral', 'Bochaganj', 'Chirirbandar', 'Fulbari', 'Ghoraghat', 'Hakimpur', 'Kaharole', 'Khansama', 'Nawabganj', 'Parbatipur'],
      'Gaibandha':   ['Gaibandha Sadar', 'Fulchhari', 'Gobindaganj', 'Palashbari', 'Sadullapur', 'Saghata', 'Sundarganj'],
      'Kurigram':    ['Kurigram Sadar', 'Bhurungamari', 'Char Rajibpur', 'Chilmari', 'Phulbari', 'Nageshwari', 'Rajarhat', 'Raumari', 'Ulipur'],
      'Lalmonirhat': ['Lalmonirhat Sadar', 'Aditmari', 'Hatibandha', 'Kaliganj', 'Patgram'],
      'Nilphamari':  ['Nilphamari Sadar', 'Domar', 'Dimla', 'Jaldhaka', 'Kishoreganj', 'Saidpur'],
      'Panchagarh':  ['Panchagarh Sadar', 'Atwari', 'Boda', 'Debiganj', 'Tetulia'],
      'Thakurgaon':  ['Thakurgaon Sadar', 'Baliadangi', 'Haripur', 'Pirganj', 'Ranisankail'],
    }
  },
  'Mymensingh': {
    districts: {
      'Mymensingh': ['Mymensingh Sadar', 'Bhaluka', 'Dhobaura', 'Fulbaria', 'Gaffargaon', 'Gauripur', 'Haluaghat', 'Ishwarganj', 'Muktagachha', 'Nandail', 'Phulpur', 'Trishal'],
      'Jamalpur':   ['Jamalpur Sadar', 'Baksiganj', 'Dewanganj', 'Islampur', 'Madarganj', 'Melandaha', 'Sarishabari'],
      'Netrokona':  ['Netrokona Sadar', 'Atpara', 'Barhatta', 'Durgapur', 'Kalmakanda', 'Khaliajuri', 'Kendua', 'Madan', 'Mohanganj', 'Purbadhala'],
      'Sherpur':    ['Sherpur Sadar', 'Jhenaigati', 'Nakla', 'Nalitabari', 'Sreebardi'],
    }
  },
};

export default function StepTwo({ data, onChange, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const divisions = Object.keys(LOCATIONS);
  const districts = data.division ? Object.keys(LOCATIONS[data.division].districts) : [];
  const upazilas  = data.division && data.district
    ? LOCATIONS[data.division].districts[data.district] || []
    : [];

  const handleDivisionChange = div =>
    onChange({ ...data, division: div, district: '', upazila: '' });

  const handleDistrictChange = district =>
    onChange({ ...data, district, upazila: '' });

  const validate = () => {
    const e = {};
    if (!data.division) e.division = 'Please select a division';
    if (!data.district) e.district = 'Please select a district';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate()) onNext(); };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
          <MapPin className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">Your Location</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Select your division, district and upazila for a location-specific plan.</p>
        </div>
      </div>

      {/* Division */}
      <div className="space-y-2.5">
        <label className="block text-sm font-semibold text-foreground">
          Division <span className="text-destructive">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {divisions.map((div, i) => {
            const isSelected = data.division === div;
            return (
              <motion.button
                key={div}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => handleDivisionChange(div)}
                className={`
                  py-2.5 px-3 rounded-xl border-2 text-sm font-medium text-center transition-all duration-200
                  ${isSelected
                    ? 'border-primary bg-primary/10 text-primary shadow-sm shadow-primary/20'
                    : 'border-border bg-card text-card-foreground hover:border-primary/40 hover:bg-muted/40'}
                `}
              >
                {div}
              </motion.button>
            );
          })}
        </div>
        <AnimatePresence>
          {errors.division && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-destructive flex items-center gap-1"
            >
              <span>⚠</span> {errors.division}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* District */}
      <AnimatePresence>
        {districts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <label className="block text-sm font-semibold text-foreground">
              District <span className="text-destructive">*</span>
            </label>
            <select
              value={data.district}
              onChange={e => handleDistrictChange(e.target.value)}
              className="w-full border border-input bg-card text-card-foreground
                         rounded-xl px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary
                         transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="">— Select District —</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <AnimatePresence>
              {errors.district && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-destructive flex items-center gap-1"
                >
                  <span>⚠</span> {errors.district}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upazila */}
      <AnimatePresence>
        {upazilas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <label className="block text-sm font-semibold text-foreground">
              Upazila <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <select
              value={data.upazila}
              onChange={e => onChange({ ...data, upazila: e.target.value })}
              className="w-full border border-input bg-card text-card-foreground
                         rounded-xl px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary
                         transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="">— Select Upazila —</option>
              {upazilas.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location summary */}
      <AnimatePresence>
        {data.district && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-primary/30 bg-primary/5"
          >
            <Navigation className="w-4 h-4 text-primary shrink-0" />
            <p className="text-sm font-medium text-foreground">
              {[data.upazila, data.district, data.division].filter(Boolean).join(', ')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onBack}
          className="flex items-center justify-center gap-2 border-2 border-border bg-card text-card-foreground
                     font-semibold py-3 px-5 rounded-xl hover:border-primary/40 hover:bg-muted/40
                     transition-all duration-200 text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handleNext}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground
                     font-semibold py-3 px-6 rounded-xl shadow-sm shadow-primary/30
                     hover:bg-primary/90 transition-all duration-200 text-sm sm:text-base"
        >
          Next → Land Details
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}