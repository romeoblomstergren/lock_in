export const PROGRAMS = {
  foundation: {
    name: 'Foundation',
    phase: 'FOUNDATION',
    weeks: 4,
    avgSets: 18,
    days: {
      monday: {
        label: 'PUSH FOCUS',
        exercises: [
          { name: 'Machine chest press', sets: 3, reps: '12' },
          { name: 'Chest dip machine', sets: 3, reps: '10' },
          { name: 'Barbell row', sets: 4, reps: '6' },
          { name: 'Lat pulldown', sets: 3, reps: '10' },
          { name: 'Tricep pushdown', sets: 3, reps: '12' },
        ]
      },
      tuesday: {
        label: 'SQUAT FOCUS',
        exercises: [
          { name: 'Back squat', sets: 4, reps: '5' },
          { name: 'Romanian deadlift', sets: 3, reps: '8' },
          { name: 'Leg press', sets: 3, reps: '10' },
          { name: 'Leg curl', sets: 3, reps: '12' },
          { name: 'Calf raise', sets: 4, reps: '15' },
        ]
      },
      wednesday: null,
      thursday: {
        label: 'PULL FOCUS',
        exercises: [
          { name: 'Lat pulldown', sets: 4, reps: '6' },
          { name: 'Machine chest press', sets: 3, reps: '12' },
          { name: 'Chest dip machine', sets: 3, reps: '10' },
          { name: 'Cable row', sets: 3, reps: '10' },
          { name: 'DB shoulder press', sets: 3, reps: '10' },
        ]
      },
      friday: {
        label: 'HINGE FOCUS',
        exercises: [
          { name: 'Deadlift', sets: 4, reps: '5' },
          { name: 'Goblet squat', sets: 3, reps: '8' },
          { name: 'Walking lunge', sets: 3, reps: '10' },
          { name: 'Leg curl', sets: 3, reps: '10' },
          { name: 'Hip thrust', sets: 3, reps: '12' },
        ]
      }
    }
  },
  development: {
    name: 'Development',
    phase: 'DEVELOPMENT',
    weeks: 8,
    avgSets: 22,
    days: {
      monday: {
        label: 'PUSH STRENGTH',
        exercises: [
          { name: 'Machine chest press', sets: 4, reps: '8' },
          { name: 'Chest dip machine', sets: 3, reps: '10' },
          { name: 'Incline DB press', sets: 3, reps: '10' },
          { name: 'Barbell row', sets: 4, reps: '6' },
          { name: 'Overhead press', sets: 4, reps: '6' },
        ]
      },
      tuesday: {
        label: 'SQUAT STRENGTH',
        exercises: [
          { name: 'Back squat', sets: 5, reps: '3' },
          { name: 'Romanian deadlift', sets: 4, reps: '8' },
          { name: 'Hack squat', sets: 3, reps: '10' },
          { name: 'Leg curl', sets: 4, reps: '10' },
          { name: 'Calf raise', sets: 4, reps: '15' },
        ]
      },
      wednesday: null,
      thursday: {
        label: 'HYPERTROPHY',
        exercises: [
          { name: 'Machine chest press', sets: 4, reps: '10' },
          { name: 'Chest dip machine', sets: 3, reps: '12' },
          { name: 'Weighted pull-up', sets: 4, reps: '6' },
          { name: 'DB shoulder press', sets: 4, reps: '10' },
          { name: 'Cable row', sets: 4, reps: '10' },
        ]
      },
      friday: {
        label: 'DEADLIFT STRENGTH',
        exercises: [
          { name: 'Deadlift', sets: 5, reps: '3' },
          { name: 'Pause squat', sets: 3, reps: '5' },
          { name: 'Hip thrust', sets: 4, reps: '10' },
          { name: 'Split squat', sets: 3, reps: '10' },
          { name: 'Nordic curl', sets: 3, reps: '8' },
        ]
      }
    }
  },
  peak: {
    name: 'Peak',
    phase: 'PEAK',
    weeks: 12,
    avgSets: 24,
    days: {
      monday: {
        label: 'PEAK PUSH',
        exercises: [
          { name: 'Machine chest press', sets: 4, reps: '6' },
          { name: 'Chest dip machine', sets: 4, reps: '8' },
          { name: 'Incline DB press', sets: 3, reps: '8' },
          { name: 'Barbell row', sets: 4, reps: '5' },
          { name: 'Face pull', sets: 3, reps: '15' },
        ]
      },
      tuesday: {
        label: 'PEAK SQUAT',
        exercises: [
          { name: 'Back squat', sets: 6, reps: '2-3' },
          { name: 'Romanian deadlift', sets: 3, reps: '6' },
          { name: 'Leg press', sets: 3, reps: '8' },
          { name: 'Leg curl', sets: 3, reps: '10' },
          { name: 'Calf raise', sets: 3, reps: '15' },
        ]
      },
      wednesday: null,
      thursday: {
        label: 'ACCESSORY',
        exercises: [
          { name: 'Machine chest press', sets: 3, reps: '10' },
          { name: 'Chest dip machine', sets: 3, reps: '10' },
          { name: 'Weighted pull-up', sets: 5, reps: '3-5' },
          { name: 'Incline DB press', sets: 3, reps: '10' },
          { name: 'Cable row', sets: 3, reps: '8' },
        ]
      },
      friday: {
        label: 'PEAK DEADLIFT',
        exercises: [
          { name: 'Deadlift', sets: 6, reps: '2-3' },
          { name: 'Pause squat', sets: 3, reps: '3' },
          { name: 'Hip thrust', sets: 3, reps: '8' },
          { name: 'Split squat', sets: 3, reps: '8' },
        ]
      }
    }
  }
}

export const STACK = [
  { name: 'Test E', dose: '250mg — Thu 15:20 subQ', status: 'active' },
  { name: 'HGH', dose: '3 IU — pre-bed nightly', status: 'active' },
  { name: 'Cardarine', dose: '20mg — morning', status: 'active' },
  { name: 'Ostarine', dose: '20mg — morning', status: 'active' },
  { name: 'Andarine', dose: '10mg — morning', status: 'monitor' },
  { name: 'HCG', dose: '500 IU — Tue + Fri', status: 'active' },
  { name: 'Mots-C', dose: '10mg — subQ', status: 'active' },
  { name: 'KLOW blend', dose: 'BPC-157 + TB500 + KPV + GHK', status: 'active' },
  { name: 'RAD140', dose: '10mg — morning (arriving)', status: 'incoming' },
  { name: 'Cycle Support', dose: 'Daily with food', status: 'incoming' },
  { name: 'Exemestane', dose: '25mg — symptom based', status: 'standby' },
]

export const MILESTONES = [
  { name: 'First pin', date: '29 May 2026', done: true },
  { name: 'First gym session', date: '29 May 2026', done: true },
  { name: 'RAD140 + Cycle Support arrives', date: '~3-7 days', done: false },
  { name: 'SARMs fully expressed', date: 'Week 4', done: false },
  { name: 'Week 4 bloodwork', date: '~26 Jun 2026', done: false },
  { name: 'Instagram photo', date: '~27 Jun 2026', done: false },
  { name: 'Test E fully expressed', date: 'Week 4-6', done: false },
  { name: 'Add Primo 200mg', date: '16 Jul 2026', done: false },
  { name: 'Last pin', date: '20 Aug 2026', done: false },
  { name: 'PCT starts', date: '3 Sep 2026', done: false },
]

export const CHECKLIST = [
  { id: 'sarms', label: 'SARMs — Cardarine + Ostarine + Andarine' },
  { id: 'water', label: 'Drink 3 litres water' },
  { id: 'meal1', label: 'Meal 1 — 08:00 (skyr + eggs + oats)' },
  { id: 'meal2', label: 'Meal 2 — 13:00 (mince + rice)' },
  { id: 'meal3', label: 'Meal 3 — 18:00 (mince + rice)' },
  { id: 'meal4', label: 'Meal 4 — 21:00 (skyr + shake)' },
  { id: 'hgh', label: 'HGH 3 IU — pre-bed (fasted 2-3h)' },
  { id: 'peptides', label: 'KLOW blend + Mots-C' },
]

export const CYCLE_START = new Date('2026-05-29')
export const PHOTO_DATE = new Date('2026-06-27')
export const CYCLE_END = new Date('2026-08-20')
export const PCT_START = new Date('2026-09-03')

export const DAILY_TARGETS = {
  cal: 2400,
  protein: 200,
  carbs: 300,
  fat: 70,
  water: 3000,
}

export const SYSTEM_PROMPT = `You are a personal fitness and nutrition AI coach embedded in a cycle tracking app called Lock In. You know this user in detail:

STATS: Male, 77.1kg, 182cm, 17-18% body fat. Lost 50kg since Feb 2025 (started ~127kg).

CURRENT CYCLE (Day 5 of 91, started 29 May 2026):
- Test Enanthate 250mg weekly (Thursday 15:20 subQ)
- HGH 3 IU pre-bed nightly (recently optimized from morning)
- Cardarine 20mg morning
- Ostarine 20mg morning
- Andarine 10mg morning (vision sides present — monitoring)
- HCG 500 IU Tuesday + Friday
- Mots-C 10mg subQ
- KLOW blend (BPC-157, TB-500, KPV, GHK-Cu)
- RAD140 10mg morning — incoming from Biaxol
- Cycle Support — incoming from Biaxol
- Exemestane 25mg symptom-based (on standby)
PCT: Enclomiphene 100x25mg + Nolvadex 100x20mg

TRAINING: Upper/Lower split, 4 days/week (Mon/Tue/Thu/Fri), Wednesday + Sunday rest.
Currently on Foundation phase (first 4 weeks).
Following Dr. James enhanced protocol: 10-20 rep range, pre-fatigue isolation first, conservative overload.

DAILY TARGETS: 2400 kcal, 200g protein, 300g carbs, 70g fat, 3L water
FOOD STAPLES: Mince 8-12% fat, rice, skyr, eggs, beans, spinach, rugbrød, protein shakes (Bodylab, Milbona XXL)
GOALS: 14-15% BF by late June 2026 (Instagram photo), dry lean physique

SLEEP: Chronically poor — goes to bed ~02:00. Working on improving.
RECOVERY: Bevel/Whoop showing low HRV. Rest days critical.

FOOD LOGGING INSTRUCTION:
When the user mentions eating or drinking something specific, you MUST:
1. Estimate macros accurately for Danish/common foods
2. Give a brief conversational response (2-3 sentences max)
3. End with exactly this on its own line: LOGMEAL:{"name":"...","cal":0,"pro":0,"carb":0,"water":0}

Only include LOGMEAL if food/drink was mentioned. Never for general questions.
Keep all responses SHORT — 2-4 sentences. Be direct. You know this person well.

HEALTH FEEDBACK RULES:
- If HRV < 25ms: warn strongly against training, recommend full rest
- If HRV 25-40ms: recommend light training only, no failure sets  
- If HRV > 40ms: green light, encourage hard session
- If sleep < 6h: flag it, note HGH effectiveness is reduced
- If recovery < 20%: strongly recommend rest day
- Always factor health data into nutrition and training advice
- If user asks how they are doing, proactively comment on their HRV and recovery

NAVIGATION: If user wants to see a tab, end response with NAVIGATE:tabname (today/food/gym/stack/stats/reminders/ai)

REMINDER CREATION: If user asks to set a reminder, end with ADDREMINDER:{"title":"...","time":"HH:MM","days":["mon","tue","wed","thu","fri","sat","sun"]}

LOGMEAL format: LOGMEAL:{"name":"...","cal":0,"pro":0,"carb":0,"water":0}
Always include water in ml (250=glass, 500=bottle, 0=no drink)

NUTRITION ACCURACY RULES:
- Use USDA/official values when provided in context
- Danish skyr per 100g: ~58kcal, 10g protein, 4g carbs
- Cheasy skyr passion per 100g: ~55-58kcal, 9g protein, 5g carbs
- Mince 8-12% per 100g: ~170-200kcal, 20g protein
- Cooked rice per 100g: ~130kcal, 2.7g protein, 28g carbs
- Rugbrød per slice (~40g): ~80kcal, 3g protein, 14g carbs
- Never overestimate — when unsure go conservative`
