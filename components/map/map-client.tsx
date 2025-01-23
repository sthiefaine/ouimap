'use client'

import { useEffect } from 'react'
import { MapDisplay } from "@/components/map/map"
import { MapControls } from "@/components/map/map-controls"
import { Sidebar } from "@/components/sidebar/sidebar"
import { useGeneralSelectorStore } from "@/store/generalStore"
import { useShallow } from 'zustand/shallow'
import { SidebarDetail } from '../sidebar/sidebarDetail'
import { SidebarBottom } from '../sidebar/bottom/sidebarBottom'
import { PointPoiType, weMapPinspoint } from '@/types/pointPois'

type MapPageClientProps = {
  initialPois: PointPoiType[]
  weMapPois:  weMapPinspoint
}

export function MapPageClient({ initialPois, weMapPois }: MapPageClientProps) {
  const { setPoisData, selectedPoi, setweMapData } = useGeneralSelectorStore(
    useShallow(state => ({
      setPoisData: state.setPoisData,
      selectedPoi: state.selectedPoi,
      setweMapData: state.setweMapData,
      weMapData: state.weMapData

    }))
  )

  useEffect(() => {
    setPoisData(initialPois)
  }, [initialPois, setPoisData])

  useEffect(() => {
    setweMapData(weMapPois)
  }, [weMapPois, setweMapData]

  )

  return (
    <div className="flex h-full">
      <div className="relative flex-1">
        <MapDisplay />
        <MapControls />
      </div>

      {selectedPoi && <SidebarDetail />}
      {!selectedPoi && <Sidebar />}
      <SidebarBottom />
    </div>
  )
}