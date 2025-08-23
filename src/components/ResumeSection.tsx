import { Box, Text } from "@chakra-ui/react";
import { Education, Extracurricular, TechnicalSkills, Experience, VolunteerWork, Certification } from "@/models/resume";
type Props = {
  education?: Education[];
  extracurricular?: Extracurricular;
  technicalskills?: TechnicalSkills;
  experience?: Experience;
  volunteerWork?: VolunteerWork;
  Certification?: Certification;
};
export default function EducationSection({ education }: Props) {
  return (
    <Box>
      {education?.map((item, index) => (
        <Box key={index}>
          <Text>
            {item.institution} 
          </Text>
          <Text>
            {item.degree} 
          </Text>
          <Text>
            {item.location}
          </Text>
          <Text>
            {item.startDate} 
          </Text>
          <Text>
            {item.endDate}
          </Text>
        </Box>
      ))}
    </Box>
  );
}
