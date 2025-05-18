"use client"
import React, { useMemo } from "react"
import ChartTab from "../common/ChartTab"
import dynamic from "next/dynamic"
import dayjs from "dayjs" // pour manipuler les dates

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false
})

export default function Statistics({ RDVEff }) {
  // Grouper les coûts par mois
  const monthlyData = useMemo(() => {
    const initialData = Array(12).fill(0) // 12 mois avec coût initial 0

    RDVEff.forEach(rdv => {
      const date = dayjs(rdv.dateRendez)
      const monthIndex = date.month() // 0 pour Janvier, 11 pour Décembre
      initialData[monthIndex] += parseFloat(rdv.cout) || 0
    })

    return initialData
  }, [RDVEff])

  const options = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left"
    },
    colors: ["#4F46E5"], // Violet foncé
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "area",
      toolbar: {
        show: false
      }
    },
    stroke: {
      curve: "smooth",
      width: 2
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0
      }
    },
    markers: {
      size: 4,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6
      }
    },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } }
    },
    dataLabels: { enabled: false },
    tooltip: {
      enabled: true,
      x: { format: "MMM" }
    },
    xaxis: {
      type: "category",
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ],
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"]
        }
      }
    }
  }

  const series = [
    {
      name: "Coût mensuel",
      data: monthlyData
    }
  ]

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Coûts des rendez-vous effectués
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Répartition des coûts par mois
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={310}
          />
        </div>
      </div>
    </div>
  )
}
