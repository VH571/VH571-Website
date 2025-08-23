import { Box, Text } from "@chakra-ui/react";
import { Resume } from "@/models/resume";
import { getDefaultResume } from "@/lib/resumeService";
import EducationSection from "@/components/ResumeSection";
import { Global } from "@emotion/react";
export default async function ResumePage() {
  let defaultResume: Resume | null = null;
  try {
    defaultResume = await getDefaultResume();
  } catch (err) {
    console.log(err);
  }
  console.log(defaultResume);

  if (!defaultResume) {
    return <Box>Failed to load resume</Box>;
  }

  return (
    
    <Box
      as="article"
      maxW="10xl"
      mx="auto"
      p={6}
      overflowX="auto"
      overflowY="hidden"
      style={{
        height: "100vh",
        columnWidth: "20rem",
        columnGap: "1.5rem",
        columnRule: "2px dashed #666",
        columnFill: "auto", 
      }}
    >
      <Text  mb="1em" lineHeight={1.5}>
        How long have I known you, Oh Canada? A hundred years? Yes, a hundred
        years. And many, many tides more. And today, when you celebrate your
        hundred years, Oh Canada, I am sad for all the Indian people throughout
        the land. For I have known you when your forests were mine; when they
        gave me my meat and my clothing. I have known you in your fruits and
        rivers where your fish flashed and danced in the sun, where the waters
        said ‘come and eat of my abundance.’ I have known you in the freedom of
        your winds. And my spirit, like your winds, once roamed this good lands.
        But in long the hundred years since the white man came, I have seen that
        freedom disappear just like the salmon going mysteriously out to sea.
        The white man’s strange customs I could not understand, pressed down
        upon me until I could no longer breathe. When I fought to protect my
        home and my land, I was called a savage. When I neither understood nor
        welcomed this new way of life, I was called lazy. When I tried to rule
        my people, I was stripped of my authority. My nation was ignored in your
        history textbooks – we were less important in the history of Canada than
        the buffalo that ranged the plains. I was ridiculed in your plays and
        motion pictures, and when I drank your fire-water, I got drunk – very,
        very drunk. And I forgot. Oh Canada, how can I celebrate with you this
        centenary, this hundred years? Shall I thank you for the reserves that
        are left me of my beautiful forests? Shall I thank you for the canned
        fish of my rivers? Shall I thank you for the loss of my pride and
        authority, even among my own people? For the lack of my will to fight
        back? No! I must forget what is past and gone. Oh God in heaven! Give me
        the courage of the olden chiefs. Let me wrestle with my surroundings.
        Let me once again, as in the days of old, dominate my environment. Let
        me humbly accept this new culture and through it rise up and go on. Oh
        god, like the thunderbird of old, I shall rise again out of the sea. I
        shall grab the instruments of the white man’s success – his education,
        his skills, and with these new tools I shall build my race into the
        proudest segment of your society. And, before I follow the great chiefs
        who have gone before us, I shall see these things come to pass. I shall
        see our young braves and our chiefs sitting in the house of law and
        government, ruling and being ruled by the knowledge and freedoms of our
        great land. So shall we shatter the barriers of our isolation. So shall
        the next hundred years be the greatest in the proud history of our
        tribes and nations.
      </Text>
      <Text  mb="1em" lineHeight={1.5}>
        How long have I known you, Oh Canada? A hundred years? Yes, a hundred
        years. And many, many tides more. And today, when you celebrate your
        hundred years, Oh Canada, I am sad for all the Indian people throughout
        the land. For I have known you when your forests were mine; when they
        gave me my meat and my clothing. I have known you in your fruits and
        rivers where your fish flashed and danced in the sun, where the waters
        said ‘come and eat of my abundance.’ I have known you in the freedom of
        your winds. And my spirit, like your winds, once roamed this good lands.
        But in long the hundred years since the white man came, I have seen that
        freedom disappear just like the salmon going mysteriously out to sea.
        The white man’s strange customs I could not understand, pressed down
        upon me until I could no longer breathe. When I fought to protect my
        home and my land, I was called a savage. When I neither understood nor
        welcomed this new way of life, I was called lazy. When I tried to rule
        my people, I was stripped of my authority. My nation was ignored in your
        history textbooks – we were less important in the history of Canada than
        the buffalo that ranged the plains. I was ridiculed in your plays and
        motion pictures, and when I drank your fire-water, I got drunk – very,
        very drunk. And I forgot. Oh Canada, how can I celebrate with you this
        centenary, this hundred years? Shall I thank you for the reserves that
        are left me of my beautiful forests? Shall I thank you for the canned
        fish of my rivers? Shall I thank you for the loss of my pride and
        authority, even among my own people? For the lack of my will to fight
        back? No! I must forget what is past and gone. Oh God in heaven! Give me
        the courage of the olden chiefs. Let me wrestle with my surroundings.
        Let me once again, as in the days of old, dominate my environment. Let
        me humbly accept this new culture and through it rise up and go on. Oh
        god, like the thunderbird of old, I shall rise again out of the sea. I
        shall grab the instruments of the white man’s success – his education,
        his skills, and with these new tools I shall build my race into the
        proudest segment of your society. And, before I follow the great chiefs
        who have gone before us, I shall see these things come to pass. I shall
        see our young braves and our chiefs sitting in the house of law and
        government, ruling and being ruled by the knowledge and freedoms of our
        great land. So shall we shatter the barriers of our isolation. So shall
        the next hundred years be the greatest in the proud history of our
        tribes and nations.
      </Text>
      
    </Box>
  );
}
