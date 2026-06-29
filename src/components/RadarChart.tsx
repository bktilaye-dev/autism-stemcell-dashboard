import ReactECharts from 'echarts-for-react'
import type { Provider } from '../types/provider'

interface Props {
  providers: Provider[]
}

const COLORS = ['#6366f1', '#0891b2', '#16a34a', '#dc2626']

const domainKeys = ['communication', 'socialSkills', 'behavior', 'selfCare'] as const

const domainLabels: Record<typeof domainKeys[number], string> = {
  communication: 'Communication',
  socialSkills: 'Social Skills',
  behavior: 'Behavior',
  selfCare: 'Self-Care',
}

export function RadarChart({ providers }: Props) {
  if (providers.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        Select 1–3 providers to see effectiveness comparison
      </div>
    )
  }

  const indicator = domainKeys.map((key) => ({
    name: domainLabels[key],
    max: 10,
  }))

  const series = providers.map((p, i) => ({
    name: p.name,
    type: 'radar',
    data: [
      {
        name: p.name,
        value: domainKeys.map((key) => p.effectiveness[key].score),
      },
    ],
    lineStyle: { color: COLORS[i % COLORS.length], width: 2 },
    areaStyle: { color: COLORS[i % COLORS.length], opacity: 0.08 },
    symbol: 'circle',
    symbolSize: 6,
    itemStyle: { color: COLORS[i % COLORS.length] },
  }))

  const option = {
    tooltip: { trigger: 'item' },
    legend: {
      data: providers.map((p) => p.name),
      bottom: 0,
      textStyle: { fontSize: 11 },
    },
    radar: {
      indicator,
      radius: '60%',
      splitNumber: 5,
      axisName: { fontSize: 11, color: '#374151' },
      splitLine: { lineStyle: { color: '#e5e7eb' } },
      splitArea: { areaStyle: { color: ['#f9fafb', '#fff'] } },
    },
    series,
  }

  return (
    <ReactECharts
      option={option}
      style={{ height: '100%', width: '100%' }}
      opts={{ renderer: 'svg' }}
    />
  )
}
