"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PersonalInfoTab } from "./tabs/personal-info-tab"
import { motion } from "framer-motion"

export function ProfileTabs({ userData, onUpdateUserData }) {
  const [activeTab, setActiveTab] = useState("personal")

  return (
    <Tabs
      defaultValue="personal"
      value={activeTab}
      onValueChange={setActiveTab}
      className="space-y-6"
    >
      <TabsList className="grid grid-cols-1 w-full">
        <TabsTrigger value="personal">Personal</TabsTrigger>
      </TabsList>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <TabsContent value="personal" className="mt-0">
          <PersonalInfoTab
            personalData={userData.personal}
            onUpdatePersonalData={(data) => onUpdateUserData('personal', data)}
          />
        </TabsContent>
      </motion.div>
    </Tabs>
  )
}