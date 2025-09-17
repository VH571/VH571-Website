import { Box, Input, InputGroup, Kbd} from "@chakra-ui/react";
import { IoMdSearch } from "react-icons/io";
export default function SearchBar() {
    <Box>
        <InputGroup flex="1" startElement={<IoMdSearch />} endElement={<Kbd>Enter</Kbd>}>
    <Input placeholder="Search contacts" />
  </InputGroup>
    </Box>
}
