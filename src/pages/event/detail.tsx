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
  AspectRatio,
  Avatar,
  ScrollArea,
  Grid,
  ActionIcon,
  Badge,
  Accordion,
  Modal,
  CopyButton,
  TextInput,
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
  MdFavorite,
  MdFavoriteBorder,
  MdBookOnline,
  MdOutlineQuestionMark,
  MdArrowForwardIos,
  MdComment,
  MdIosShare,
} from "react-icons/md";
import { TbCoinRupee, TbInfoTriangle } from "react-icons/tb";

import { useParams } from "react-router";

import { useEventDetail, useLikeEvent } from "src/workflow/events";
import { useCallback, useEffect, useState } from "react";

import classes from "./detail.module.css";

const GROUP_GAP = 6;

function EventDetailPage() {
  const { eventId } = useParams();

  const [isTextEnlarged, setIsTextEnlarged] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const { data, isLoading } = useEventDetail(eventId!);
  const { mutate: updateLike } = useLikeEvent();

  const [likesCount, setLikesCount] = useState(0);

  const onLikeClick = useCallback(() => {
    const likeCountKey = `likeCount_${eventId}`;
    const likeCount = parseInt(localStorage.getItem(likeCountKey) || "0");

    if (likeCount >= 2) {
      // Do nothing if the user has already liked the event twice
      return;
    }

    let isNextLike = false;

    setLiked((prev) => {
      isNextLike = !prev;
      return !prev;
    });

    if (!isNextLike) {
      localStorage.setItem(likeCountKey, (likeCount + 1).toString());
    }
    updateLike({
      eventId: eventId!,
      liked: !isNextLike,
    });
    setLikesCount((prevLikesCount) => {
      if (isNextLike) {
        return prevLikesCount + 1;
      } else {
        return prevLikesCount - 1;
      }
    });
  }, [eventId, updateLike]);

  const onShareClick = useCallback(() => {
    setShowShareModal(true);
  }, []);

  useEffect(() => {
    const likeCountKey = `likeCount_${eventId}`;
    const likeCount = parseInt(localStorage.getItem(likeCountKey) || "0");
    setLiked(likeCount > 0);
  }, [eventId]);

  useEffect(() => {
    setLikesCount(data?.likesCount || 0);
  }, [data?.likesCount]);

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
    <Container
      size="lg"
      p="lg"
      bg={"dark.8"}
      w={"100vw"}
      style={{ maxWidth: "100vw", overflowX: "hidden" }}
    >
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
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
          }}
        >
          <ActionIcon
            variant="filled"
            radius="xl"
            size="lg"
            onClick={onShareClick}
            bg={"dark.4"}
          >
            <MdIosShare size={22} />
          </ActionIcon>

          <Badge
            style={{
              position: "absolute",
              top: 2,
              right: 2,
              zIndex: 10,
              transform: "translate(50%, -50%)",
            }}
            size="sm"
            circle
          >
            {likesCount}
          </Badge>

          <ActionIcon
            variant="filled"
            radius="xl"
            size="lg"
            ml={"md"}
            onClick={onLikeClick}
            bg={"dark.4"}
            style={{
              color: liked ? "red" : "white",
              transition: "all 0.2s ease",
            }}
          >
            {liked ? <MdFavorite size={22} /> : <MdFavoriteBorder size={22} />}
          </ActionIcon>
        </div>
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
              fontWeight: 500,
              textDecoration: "underline",
              textDecorationStyle: "dashed",
              textUnderlineOffset: "4px",
              textDecorationThickness: "1.5px",
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
                <TbCoinRupee size={20} />
              </div>
              <Text size="sm" fw={500}>
                starts at ₹{data.ticketAmount}
              </Text>
            </Group>

            <Button
              size="xs"
              radius={"xl"}
              variant="white"
              component="a"
              href={data.ticketLink}
              leftSection={<MdBookOnline size={16} />}
              target="_blank"
            >
              Get tickets
            </Button>
          </Flex>
        </Paper>

        <Grid mt={"md"}>
          <Grid.Col span={{ base: 6, sm: 3 }}>
            <Group gap={GROUP_GAP} title="Ideal for">
              <MdOutlinePerson size={20} />
              <Text>ideal for {data?.eventFeatures.minimumAge}+ years</Text>
            </Group>
          </Grid.Col>
          <Grid.Col span={{ base: 6, sm: 2 }}>
            <Group gap={GROUP_GAP} maw={80} title="Event Duration">
              <MdHourglassTop size={20} />
              <Text>{data?.eventDurationDisplay}</Text>
            </Group>
          </Grid.Col>
          <Grid.Col span={{ base: 6, sm: 3 }}>
            <Group gap={GROUP_GAP} title="Supported Languages">
              <MdLanguage size={20} />
              <Text>{data?.supportedLanguages.join(", ")}</Text>
            </Group>
          </Grid.Col>
        </Grid>
      </Box>

      {/* <Paper shadow="md" radius="lg" p="xs" mt="md" withBorder bg="#2D2C2C"> */}
      <Accordion
        variant="contained"
        mt={"md"}
        classNames={classes}
        chevron={<MdArrowForwardIos size={32} />}
      >
        <Accordion.Item value="event-policy">
          <Accordion.Control icon={<TbInfoTriangle />}>
            <Text fw={"bold"}>Venue Policy & Conditions</Text>
          </Accordion.Control>
          <Accordion.Panel>{data.policyAndConditions}</Accordion.Panel>
        </Accordion.Item>
        <Divider ml={"sm"} mr={"sm"} />
        <Accordion.Item value="print">
          <Accordion.Control icon={<MdOutlineQuestionMark />}>
            <Text fw={"bold"}>Frequently Asked Questions</Text>
          </Accordion.Control>
          <Accordion.Panel>
            {data.frequentlyAskedQuestions?.length === 0 ? (
              <Text>N/A</Text>
            ) : null}
            {data.frequentlyAskedQuestions?.map((question) => (
              <div key={question.question} style={{ marginBottom: "10px" }}>
                <Group gap={GROUP_GAP} mb={4}>
                  <MdOutlineQuestionMark size={16} />
                  <Text size="sm">{question.question}</Text>
                </Group>
                <Group gap={GROUP_GAP}>
                  <MdComment size={14} />
                  <Text size="sm">{question.answer}</Text>
                </Group>
              </div>
            ))}
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      {/* </Paper> */}

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

      {data.joinChatDetails?.isEnabled ? (
        <Button
          variant="white"
          color="white"
          radius={"xl"}
          pl={"xl"}
          pr={"xl"}
          leftSection={<MdComment fill="dark" />}
          onClick={() => {
            window.open(data.joinChatDetails?.chatLink);
          }}
          style={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
          }}
        >
          <Text c={"dark"}>Join Chat</Text>
        </Button>
      ) : null}

      <Space h="xl" />

      <Modal
        opened={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share event"
        centered
      >
        <Paper radius={"md"} p={"sm"} bg={"dark.5"}>
          <CopyButton value={window.location.href}>
            {({ copied, copy }) => (
              <TextInput
                value={window.location.href}
                readOnly
                radius="md"
                rightSectionWidth={80}
                rightSection={
                  <Button color="blue" radius="xl" size="xs" onClick={copy}>
                    {copied ? "Copied" : "Copy"}
                  </Button>
                }
              />
            )}
          </CopyButton>
        </Paper>
      </Modal>
    </Container>
  );
}

export default EventDetailPage;
