/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        evidence: {
          high: '#16a34a',
          moderate: '#ca8a04',
          low: '#ea580c',
          anecdotal: '#6b7280',
        },
        cell: {
          muse: '#7c3aed',
          umbilical: '#0891b2',
          bone_marrow: '#b45309',
          spinal: '#dc2626',
        },
      },
    },
  },
  plugins: [],
}
