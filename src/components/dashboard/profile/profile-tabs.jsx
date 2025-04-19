"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PersonalInfoTab } from "./tabs/personal-info-tab"
import { ProfessionalInfoTab } from "./tabs/professional-info-tab"
import { SkillsTab } from "./tabs/skills-tab"
import { EquipmentTab } from "./tabs/equipment-tab"
import { ActivityTab } from "./tabs/activity-tab"
import { motion } from "framer-motion"

export function ProfileTabs({ userData, onUpdateUserData, onAddSkill, onRemoveSkill }) {
  const [activeTab, setActiveTab] = useState("personal")

  return (
    <Tabs 
      defaultValue="personal" 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="space-y-6"
    >
      <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="professional">Professional</TabsTrigger>
        <TabsTrigger value="skills">Skills & Expertise</TabsTrigger>
        <TabsTrigger value="equipment">Equipment</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
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
        
        <TabsContent value="professional" className="mt-0">
          <ProfessionalInfoTab 
            professionalData={userData.professional} 
            onUpdateProfessionalData={(data) => onUpdateUserData('professional', data)} 
          />
        </TabsContent>
        
        <TabsContent value="skills" className="mt-0">
          <SkillsTab 
            skills={userData.skills} 
            specializations={userData.specializations}
            onAddSkill={onAddSkill}
            onRemoveSkill={onRemoveSkill}
            onUpdateSpecializations={(data) => onUpdateUserData('specializations', data)}
          />
        </TabsContent>
        
        <TabsContent value="equipment" className="mt-0">
          <EquipmentTab assignedEquipment={userData.assignedEquipment} />
        </TabsContent>
        
        <TabsContent value="activity" className="mt-0">
          <ActivityTab activityLogs={userData.activityLogs} />
        </TabsContent>
      </motion.div>
    </Tabs>
  )
}