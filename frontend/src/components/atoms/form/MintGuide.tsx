import { ListItem, UnorderedList, textDecoration } from "@chakra-ui/react";
import { useLocale } from "src/hooks/useLocale";

export const MintGuide = () => {
  const { t } = useLocale();
  const guide = t.MINTGUIDE;
  return (
    <>
      <UnorderedList pl={4}>
        <>
          {guide.map((item, index) => (
            <ListItem key={index} className="renderlinkunderline">
              <p dangerouslySetInnerHTML={{ __html: item }} />
            </ListItem>
          ))}
        </>
      </UnorderedList>
    </>
  );
};