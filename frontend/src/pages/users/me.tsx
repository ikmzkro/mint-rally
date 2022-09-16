import {
  Box,
  Flex,
  Heading,
  Text,
  Spinner,
  Image,
  Container,
} from "@chakra-ui/react";

import { IOwnedNFT, useGetOwnedNFTs } from "../../hooks/useMintNFTManager";
import { FC, useMemo } from "react";
import { useEventGroups } from "../../hooks/useEventManager";
import { ipfs2http } from "../../../utils/ipfs2http";

const User = () => {
  const { ownedNFTs, loading } = useGetOwnedNFTs();
  const { groups } = useEventGroups();

  const nftCollectionsByGroup = useMemo(() => {
    const grouped = ownedNFTs.reduce<Record<number, IOwnedNFT[]>>(
      (nfts, current) => {
        const { traits } = current;
        nfts[traits.eventGroupId] = nfts[traits.eventGroupId] ?? [];
        nfts[traits.eventGroupId].push(current);
        return nfts;
      },
      {}
    );
    return grouped;
  }, [groups, ownedNFTs]);

  const ImageBadge = ({ image, name }: { image: string; name: string }) => (
    <Flex justifyContent="center" alignItems="center" flexDirection="column">
      <Box>
        <Image src={image} alt={name} />
      </Box>
      <Box>
        <Text fontSize="md" fontWeight="bold" mt={2}>
          {name}
        </Text>
      </Box>
    </Flex>
  );

  const Collection: FC<{
    collectionData: { image: string; name: string; description: string }[];
  }> = ({ collectionData }) => {
    return (
      <Flex
        flexWrap="wrap"
        justifyContent="flex-start"
        position="relative"
        mt={4}
        w="100%"
      >
        {collectionData.map((data, i) => {
          return (
            <Box
              key={i}
              width={{ base: "50%", sm: "33%", md: "25%", lg: "20%" }}
              mb={8}
              textAlign="center"
            >
              {ImageBadge({ image: data.image, name: data.name })}
            </Box>
          );
        })}
      </Flex>
    );
  };

  return (
    <Container maxW="1000">
      <Box mt={10}>
        <Heading as="h1" size="xl" color="mint.primary" fontWeight={700}>
          NFT Collection
        </Heading>
      </Box>
      {loading ? (
        <Spinner />
      ) : (
        groups.length > 0 &&
        Object.entries(nftCollectionsByGroup).map(([groupIdString, nfts]) => {
          const id = groupIdString;
          const data = nfts.map(({ name, image, description }) => ({
            name,
            description,
            image: ipfs2http(image),
          }));

          return (
            <div key={id}>
              <Box width="100%" mt={10}>
                <Heading
                  as="h2"
                  size="lg"
                  color="mint.primary"
                  fontWeight={400}
                >
                  {
                    groups.find((g) => g.groupId.toNumber() === Number(id))
                      ?.name
                  }
                </Heading>
                <Box mt={4}>
                  <div style={{ border: "2px #56F0DE solid" }} />
                </Box>
                <Flex justifyContent="space-between">
                  {<Collection collectionData={data} />}
                </Flex>
              </Box>
            </div>
          );
        })
      )}
    </Container>
  );
};

export default User;
