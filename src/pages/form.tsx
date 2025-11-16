import FormComponent from '@/components/FormComponent'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

export const Form = ({isEdit=false}:{isEdit?: boolean}) => {
  return (
    <Card className='px-8 py-6'>
        <CardHeader>
            <CardTitle>RHF Form</CardTitle>
        </CardHeader>
        <CardContent>
            {!isEdit ? <FormComponent />: <FormComponent
                initialData={{
                  id: "1",
                  language: "en",
                  username: "goku",
                  hasWorkExperience: true,
                  companyName: "goku PVT LTD",
                  educationLevel: "bachelorsDegree",
                  universityName: "Ganpat university",
                  knowsOtherLanguages: true,
                  languages: [{name: "hindi"},{name: "english"},{name: "gujarati"}]
                }}
              />}
        </CardContent>
        <CardFooter>
            <CardDescription>Build with shadcn component using RHF and zod</CardDescription>
        </CardFooter>
    </Card>
  )
}
