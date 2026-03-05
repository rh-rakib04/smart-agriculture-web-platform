'use client';

import { useState } from 'react';
import { MapPin, ChevronRight, ChevronLeft, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LOCATIONS = {
  'Dhaka': { districts: { 'Dhaka': ['Dhanmondi','Mirpur','Uttara','Mohammadpur','Tejgaon','Savar','Keraniganj'], 'Gazipur': ['Gazipur Sadar','Kaliakair','Kapasia','Sreepur','Kaliganj'], 'Manikganj': ['Manikganj Sadar','Singair','Shibalaya','Saturia','Ghior'], 'Munshiganj': ['Munshiganj Sadar','Srinagar','Sirajdikhan','Louhajang','Tongibari'], 'Narsingdi': ['Narsingdi Sadar','Palash','Shibpur','Belabo','Raipura'], 'Narayanganj': ['Narayanganj Sadar','Araihazar','Sonargaon','Rupganj','Bandar'], 'Faridpur': ['Faridpur Sadar','Bhanga','Saltha','Nagarkanda','Boalmari'], 'Gopalganj': ['Gopalganj Sadar','Kashiani','Kotalipara','Muksudpur','Tungipara'], 'Madaripur': ['Madaripur Sadar','Shibchar','Kalkini','Rajoir'], 'Rajbari': ['Rajbari Sadar','Goalanda','Pangsha','Baliakandi','Kalukhali'], 'Shariatpur': ['Shariatpur Sadar','Naria','Zanjira','Gosairhat','Damudya'], 'Tangail': ['Tangail Sadar','Kalihati','Sakhipur','Mirzapur','Ghatail','Basail'], 'Kishoreganj': ['Kishoreganj Sadar','Bhairab','Kuliarchar','Bajitpur','Itna'] } },
  'Chittagong': { districts: { 'Chittagong': ['Chittagong Sadar','Hathazari','Raozan','Sitakunda','Mirsarai','Patiya','Anwara'], "Cox's Bazar": ["Cox's Bazar Sadar",'Teknaf','Ukhiya','Ramu','Chakaria','Pekua'], 'Comilla': ['Comilla Sadar','Daudkandi','Chandina','Muradnagar','Brahmanpara','Laksam'], 'Feni': ['Feni Sadar','Chhagalnaiya','Daganbhuiyan','Parshuram','Sonagazi'], 'Brahmanbaria': ['Brahmanbaria Sadar','Kasba','Nabinagar','Sarail','Ashuganj','Akhaura'], 'Chandpur': ['Chandpur Sadar','Hajiganj','Kachua','Matlab Uttar','Matlab Dakshin'], 'Lakshmipur': ['Lakshmipur Sadar','Raipur','Ramganj','Ramgati','Kamalnagar'], 'Noakhali': ['Noakhali Sadar','Begumganj','Hatiya','Subarnachar','Companiganj'], 'Khagrachhari': ['Khagrachhari Sadar','Dighinala','Panchhari','Mahalchhari','Manikchhari'], 'Rangamati': ['Rangamati Sadar','Kaptai','Kawkhali','Bagaichhari','Barkal'], 'Bandarban': ['Bandarban Sadar','Alikadam','Naikhongchhari','Rowangchhari','Thanchi'] } },
  'Rajshahi': { districts: { 'Rajshahi': ['Rajshahi Sadar','Paba','Godagari','Tanore','Mohanpur','Bagha','Charghat'], 'Bogura': ['Bogura Sadar','Shibganj','Gabtali','Sherpur','Nandigram','Kahalu'], 'Chapainawabganj': ['Chapainawabganj Sadar','Shibganj','Gomastapur','Nachole','Bholahat'], 'Joypurhat': ['Joypurhat Sadar','Akkelpur','Kalai','Khetlal','Panchbibi'], 'Naogaon': ['Naogaon Sadar','Atrai','Raninagar','Manda','Niamatpur','Badalgachhi'], 'Natore': ['Natore Sadar','Baraigram','Gurudaspur','Lalpur','Singra'], 'Pabna': ['Pabna Sadar','Ishwardi','Atgharia','Bera','Bhangura','Chatmohar'], 'Sirajganj': ['Sirajganj Sadar','Ullapara','Shahjadpur','Kazipur','Belkuchi','Raiganj'] } },
  'Khulna': { districts: { 'Khulna': ['Khulna Sadar','Dumuria','Batiaghata','Dacope','Paikgachha','Koyra'], 'Bagerhat': ['Bagerhat Sadar','Mongla','Fakirhat','Mollahat','Kachua','Morrelganj'], 'Satkhira': ['Satkhira Sadar','Assasuni','Debhata','Kalaroa','Kaliganj','Shyamnagar'], 'Jessore': ['Jessore Sadar','Abhaynagar','Bagherpara','Chaugachha','Jhikargacha','Manirampur'], 'Jhenaidah': ['Jhenaidah Sadar','Harinakunda','Kaliganj','Kotchandpur','Maheshpur','Shailkupa'], 'Kushtia': ['Kushtia Sadar','Kumarkhali','Khoksa','Mirpur','Daulatpur','Bheramara'], 'Magura': ['Magura Sadar','Mohammadpur','Shalikha','Sreepur'], 'Meherpur': ['Meherpur Sadar','Gangni','Mujibnagar'], 'Narail': ['Narail Sadar','Lohagara','Kalia'] } },
  'Barishal': { districts: { 'Barishal': ['Barishal Sadar','Agailjhara','Babuganj','Bakerganj','Banaripara','Gaurnadi','Hizla'], 'Bhola': ['Bhola Sadar','Burhanuddin','Char Fasson','Daulatkhan','Lalmohan','Manpura'], 'Jhalokati': ['Jhalokati Sadar','Kathalia','Nalchity','Rajapur'], 'Patuakhali': ['Patuakhali Sadar','Bauphal','Dashmina','Galachipa','Kalapara','Mirzaganj'], 'Pirojpur': ['Pirojpur Sadar','Bhandaria','Kawkhali','Mathbaria','Nazirpur','Nesarabad'], 'Barguna': ['Barguna Sadar','Amtali','Bamna','Betagi','Patharghata','Taltali'] } },
  'Sylhet': { districts: { 'Sylhet': ['Sylhet Sadar','Beanibazar','Bishwanath','Companiganj','Fenchuganj','Golapganj','Jaintiapur'], 'Moulvibazar': ['Moulvibazar Sadar','Barlekha','Juri','Kamalganj','Kulaura','Rajnagar','Sreemangal'], 'Habiganj': ['Habiganj Sadar','Ajmiriganj','Baniachong','Bahubal','Chunarughat','Lakhai','Madhabpur','Nabiganj'], 'Sunamganj': ['Sunamganj Sadar','Bishwamvarpur','Chhatak','Derai','Dharampasha','Dowarabazar','Jagannathpur','Jamalganj'] } },
  'Rangpur': { districts: { 'Rangpur': ['Rangpur Sadar','Badarganj','Gangachara','Kaunia','Mithapukur','Pirgachha','Pirganj','Taraganj'], 'Dinajpur': ['Dinajpur Sadar','Birampur','Birganj','Biral','Bochaganj','Chirirbandar','Fulbari','Ghoraghat','Hakimpur','Kaharole','Khansama','Nawabganj','Parbatipur'], 'Gaibandha': ['Gaibandha Sadar','Fulchhari','Gobindaganj','Palashbari','Sadullapur','Saghata','Sundarganj'], 'Kurigram': ['Kurigram Sadar','Bhurungamari','Char Rajibpur','Chilmari','Phulbari','Nageshwari','Rajarhat','Raumari','Ulipur'], 'Lalmonirhat': ['Lalmonirhat Sadar','Aditmari','Hatibandha','Kaliganj','Patgram'], 'Nilphamari': ['Nilphamari Sadar','Domar','Dimla','Jaldhaka','Kishoreganj','Saidpur'], 'Panchagarh': ['Panchagarh Sadar','Atwari','Boda','Debiganj','Tetulia'], 'Thakurgaon': ['Thakurgaon Sadar','Baliadangi','Haripur','Pirganj','Ranisankail'] } },
  'Mymensingh': { districts: { 'Mymensingh': ['Mymensingh Sadar','Bhaluka','Dhobaura','Fulbaria','Gaffargaon','Gauripur','Haluaghat','Ishwarganj','Muktagachha','Nandail','Phulpur','Trishal'], 'Jamalpur': ['Jamalpur Sadar','Baksiganj','Dewanganj','Islampur','Madarganj','Melandaha','Sarishabari'], 'Netrokona': ['Netrokona Sadar','Atpara','Barhatta','Durgapur','Kalmakanda','Khaliajuri','Kendua','Madan','Mohanganj','Purbadhala'], 'Sherpur': ['Sherpur Sadar','Jhenaigati','Nakla','Nalitabari','Sreebardi'] } },
};

export default function StepTwo({ data, onChange, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const divisions = Object.keys(LOCATIONS);
  const districts = data.division ? Object.keys(LOCATIONS[data.division].districts) : [];
  const upazilas  = data.division && data.district ? LOCATIONS[data.division].districts[data.district] || [] : [];

  const validate = () => {
    const e = {};
    if (!data.division) e.division = 'Please select a division';
    if (!data.district) e.district = 'Please select a district';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-7"
    >

      {/* Division */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-foreground">
          Division <span className="text-destructive">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {divisions.map((div, i) => {
            const isSelected = data.division === div;
            return (
              <motion.button
                key={div}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => onChange({ ...data, division: div, district: '', upazila: '' })}
                className={`py-3 px-2 rounded-2xl border-2 text-sm font-bold text-center
                  transition-all duration-200
                  ${isSelected
                    ? 'border-primary bg-primary/10 text-primary shadow-md shadow-primary/15 ring-4 ring-primary/10'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/30 hover:bg-muted/30 hover:text-foreground'
                  }`}
              >
                {div}
              </motion.button>
            );
          })}
        </div>
        <AnimatePresence>
          {errors.division && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="text-xs text-destructive flex items-center gap-1.5">
              ⚠ {errors.division}
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
            transition={{ duration: 0.35 }}
            className="space-y-3 overflow-hidden"
          >
            <label className="block text-sm font-bold text-foreground">
              District <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <select
                value={data.district}
                onChange={e => onChange({ ...data, district: e.target.value, upazila: '' })}
                className="w-full border-2 border-input bg-card text-card-foreground
                  rounded-2xl px-4 py-3 text-sm font-medium
                  focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10
                  transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="">— Select District —</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">▾</div>
            </div>
            <AnimatePresence>
              {errors.district && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-xs text-destructive flex items-center gap-1.5">
                  ⚠ {errors.district}
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
            transition={{ duration: 0.35 }}
            className="space-y-3 overflow-hidden"
          >
            <label className="block text-sm font-bold text-foreground">
              Upazila
              <span className="ml-2 text-xs font-normal text-muted-foreground">(optional)</span>
            </label>
            <div className="relative">
              <select
                value={data.upazila}
                onChange={e => onChange({ ...data, upazila: e.target.value })}
                className="w-full border-2 border-input bg-card text-card-foreground
                  rounded-2xl px-4 py-3 text-sm font-medium
                  focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10
                  transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="">— Select Upazila —</option>
                {upazilas.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">▾</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location summary */}
      <AnimatePresence>
        {data.district && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl
              border-2 border-primary/30 bg-primary/5"
          >
            <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
              <Navigation size={15} className="text-primary" />
            </div>
            <p className="text-sm font-semibold text-foreground">
              {[data.upazila, data.district, data.division].filter(Boolean).join(', ')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
          type="button" onClick={onBack}
          className="flex items-center justify-center gap-2 border-2 border-border bg-card
            text-muted-foreground font-bold py-3.5 px-5 rounded-2xl
            hover:border-primary/30 hover:text-foreground hover:bg-muted/30
            transition-all duration-200 text-sm"
        >
          <ChevronLeft size={16} /> Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.01, y: -1 }} whileTap={{ scale: 0.98 }}
          type="button" onClick={() => { if (validate()) onNext(); }}
          className="flex-1 flex items-center justify-center gap-2.5
            bg-primary text-primary-foreground font-bold py-3.5 px-6
            rounded-2xl shadow-lg shadow-primary/25
            hover:bg-primary/90 transition-all duration-200 text-sm"
        >
          Next — Land Details <ChevronRight size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
}