import { Carousel } from "@mantine/carousel";
import {
  Button,
  Text,
  Group,
  Image,
  Container,
  Title,
  Space,
  Flex,
  Loader,
  Center,
  Paper,
  Anchor,
  Divider,
  Box,
  SimpleGrid,
  AspectRatio,
  Avatar,
  ScrollArea,
} from "@mantine/core";
import {
  MdCalendarToday,
  MdLanguage,
  MdAccessible,
  MdHeadset,
  MdLocalParking,
  MdSmokingRooms,
  MdRestaurant,
  MdHourglassTop,
  MdOutlinePerson,
  MdOutlineLocationOn,
  MdCurrencyRupee,
  MdConfirmationNumber,
} from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router";

import { Env } from "../../constants";
import { EventDetail } from "../../workflow/events";
import { useState } from "react";
import classes from "./detail.module.css";

const GROUP_GAP = 6;

export default function EventDetailPage() {
  const { eventId } = useParams();

  const [isTextEnlarged, setIsTextEnlarged] = useState(false);

  const { data, isLoading } = useQuery<EventDetail>({
    queryKey: ["eventDetail"],
    queryFn: async () => {
      const res = await axios({
        baseURL: Env.VITE_API_BASE_URL,
        url: `/event/${eventId}`,
        method: "GET",
      });
      return new EventDetail(res.data);
    },
  });

  if (isLoading)
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.6)",
          zIndex: 10,
        }}
      >
        <Center style={{ height: "100%" }}>
          <Loader size="lg" color="blue" />
        </Center>
      </div>
    );

  if (!data)
    return (
      <Center w="100%" h="100vh">
        <Text>404 Event not found</Text>
      </Center>
    );

  return (
    <Container size="lg" p="lg" bg={"black"}>
      <title>{data.eventName}</title>
      <div style={{ position: "relative" }}>
        <Carousel withIndicators loop classNames={classes}>
          {data?.highlightImages.map((img) => (
            <Carousel.Slide key={img}>
              <AspectRatio ratio={1080 / 720} mx="auto">
                <Image
                  src={img}
                  height={300}
                  radius="md"
                  fit="contain"
                  alt="Concert Image"
                />
              </AspectRatio>
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>

      <Title order={2} mt={"xs"}>
        {data?.eventName}
      </Title>

      <Paper shadow="md" radius="lg" p="xs" mt="md" withBorder bg="#2D2C2C">
        <Group gap={GROUP_GAP} title="Event Date and Time">
          <MdCalendarToday size={20} />
          <Text>{data?.eventDateAndTimeDisplay}</Text>
        </Group>
        <Divider my="sm" />
        <Group gap={GROUP_GAP} align="center" title="Venue" wrap="nowrap">
          <MdOutlineLocationOn size={20} />
          <Anchor
            href={data?.venue?.googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            underline="always"
          >
            {data?.venue?.fullAddressDisplay}
          </Anchor>
        </Group>
      </Paper>

      {data?.attendeesCount ? (
        <Paper shadow="md" radius="lg" p="4px" mt="md" withBorder bg="#2D2C2C">
          <Group gap={GROUP_GAP} align="center">
            <Avatar size={32} />

            <Text>
              {data?.attendeesCount}{" "}
              {data.attendeesCount === 1 ? "attendee" : "attendees"}
            </Text>
          </Group>
        </Paper>
      ) : null}

      <Box mt="lg">
        <Title order={4} mb="sm">
          About
        </Title>
        <Text c="gray" fz="sm" lineClamp={isTextEnlarged ? 0 : 3}>
          {data?.eventDescription}
        </Text>
        <Group>
          <Button
            component="a"
            variant="subtle"
            color="white"
            style={{
              textDecoration: "underline",
              textDecorationStyle: "dashed",
              textUnderlineOffset: "5px",
              textDecorationThickness: "2px",
            }}
            p={0}
            m={0}
            size="xs"
            onClick={() => setIsTextEnlarged((prev) => !prev)}
          >
            {isTextEnlarged ? "Read less" : "Read more"}
          </Button>
          <Divider my="sm" variant="dashed" />
        </Group>

        <Group gap={16} mt="md">
          {data.eventFeatures.foodAvailable && (
            <MdRestaurant title="Food Available" size={24} />
          )}
          {data.eventFeatures.smokingAllowed && (
            <MdSmokingRooms title="Smoking Available" size={24} />
          )}
          {data.eventFeatures.wheelchairAccess && (
            <MdAccessible title="WheelChair Available" size={24} />
          )}
          {data.eventFeatures.parkingAvailable && (
            <MdLocalParking title="Parking Available" size={24} />
          )}
          {data.eventFeatures.supportAvailable && (
            <MdHeadset title="Support Available" size={24} />
          )}
        </Group>

        <Paper
          radius="lg"
          mt={"md"}
          p="6px"
          // bg="dark.8"
          bg="#2D2C2C"
          maw={{ base: "100%", sm: 400 }}
        >
          <Flex
            direction="row"
            align="center"
            justify={"space-between"}
            gap={{ base: 0, sm: "sm" }}
          >
            <Group gap={2} align="center">
              {/* TODO: add currency icon */}
              <div
                style={{
                  borderRadius: "60px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 30,
                  height: 30,
                  borderColor: "white",
                  borderWidth: "2px",
                  position: "relative",
                }}
              >
                <MdCurrencyRupee size={18} />
              </div>
              <Text size="sm" fw={500}>
                starts at ₹ {data.ticketAmount}
              </Text>
            </Group>

            <Button
              size="xs"
              radius={"xl"}
              variant="white"
              component="a"
              href={data.ticketLink}
              leftSection={<MdConfirmationNumber size={16} />}
              target="_blank"
            >
              Get tickets
            </Button>
          </Flex>
        </Paper>

        <Group mt="xs" gap={GROUP_GAP} align="center">
          <SimpleGrid
            cols={{
              base: 2,
              sm: 3,
            }}
          >
            <Group gap={GROUP_GAP} title="Ideal for">
              <MdOutlinePerson size={20} />
              <Text>ideal for {data?.eventFeatures.minimumAge}+ years</Text>
            </Group>
            <Group gap={GROUP_GAP} title="Event Duration">
              <MdHourglassTop size={20} />
              <Text>{data?.eventDurationDisplay}</Text>
            </Group>
            <Group gap={GROUP_GAP} title="Supported Languages">
              <MdLanguage size={20} />
              <Text>{data?.supportedLanguages.join(", ")}</Text>
            </Group>
          </SimpleGrid>
        </Group>
      </Box>

      {data?.galleryImages.length > 0 && (
        <>
          <Title order={4} mt="xl" mb="md">
            Gallery
          </Title>

          <ScrollArea type="never" scrollbarSize={0}>
            <Flex gap="md" wrap="nowrap" direction="row">
              {data.galleryImages.map((image) => (
                <Image
                  key={image}
                  src={image}
                  radius="lg"
                  fit="cover"
                  style={{
                    width: 220,
                    height: 220,
                    cursor: "pointer",
                    transition: "0.3s",
                    objectFit: "cover",
                  }}
                />
              ))}
            </Flex>
          </ScrollArea>
        </>
      )}

      <Space h="xl" />
    </Container>
  );
}
