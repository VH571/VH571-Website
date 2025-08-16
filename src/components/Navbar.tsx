import Link from "next/link";
import { Box, VStack } from "@chakra-ui/react";

export default function Navbar(){
    return(
         <Box bg={"var(--color-seashell)"} height={"100%"} fontWeight={"bold"} fontSize={"2.5rem"}>
            <VStack color={"var(--color-text)"}>
                <Link href={"/"}>Home</Link>
                <Link href={"/portfolio"}>Portfolio</Link>
                <Link href={"/resume"}>Resume</Link>
                <Link href={"/contact"}>Contact</Link>
            </VStack>
        </Box>
    );

}