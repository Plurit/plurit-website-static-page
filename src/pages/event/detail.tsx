import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
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
  List,
  Tooltip,
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
  MdArrowForwardIos,
  MdComment,
  MdIosShare,
  MdOutlineHelpOutline,
  MdOutlinePets,
  MdOutlinePool,
  MdOutlineQrCode,
  MdFamilyRestroom,
  MdLiquor,
} from "react-icons/md";
import { TbCoinRupee, TbInfoTriangle } from "react-icons/tb";
import { useParams } from "react-router";

import DanceIcon from "src/assets/dance.svg?react";
import { useEventDetail, useLikeEvent } from "src/workflow/events";

import classes from "./detail.module.css";

const GROUP_GAP = 8;

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
    const isLikedKey = `isLiked_${eventId}`;
    const likeCount = parseInt(localStorage.getItem(likeCountKey) || "0");

    if (likeCount >= 2) {
      // Do nothing if the user has already liked the event twice
      return;
    }

    let isNextLike = false;

    setLiked((prev) => {
      isNextLike = !prev;
      return isNextLike;
    });

    if (isNextLike) {
      localStorage.setItem(likeCountKey, (likeCount + 1).toString());
    }
    localStorage.setItem(isLikedKey, isNextLike.toString());

    updateLike({
      eventId: eventId!,
      liked: isNextLike,
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
    const isLikedKey = `isLiked_${eventId}`;
    const isLiked = JSON.parse(localStorage.getItem(isLikedKey) || "{}");
    setLiked(isLiked);
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
      bg={"black"}
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

      <Paper shadow="md" radius="lg" p="xs" mt="md" withBorder>
        <Group gap={GROUP_GAP} title="Event Date and Time">
          <MdCalendarToday size={20} />
          <Text size="sm" fw={"500"}>
            {data?.eventDateAndTimeDisplay}
          </Text>
        </Group>
        <Divider my="sm" />
        <Group gap={GROUP_GAP} align="center" title="Venue" wrap="nowrap">
          <MdOutlineLocationOn size={20} />
          <Anchor
            href={data?.venue?.googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            underline="always"
            fw={"500"}
          >
            {data?.venue?.fullAddressDisplay}
          </Anchor>
        </Group>
      </Paper>

      {data?.attendeesCount ? (
        <Paper shadow="md" radius="lg" p="4px" mt="md" withBorder>
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
        <Title order={4} mb="sm" fw={"500"} c={"white"}>
          About
        </Title>
        <Text c="#D2D2D2" lineClamp={isTextEnlarged ? 0 : 3}>
          {data?.eventDescription}
        </Text>
        <Group>
          <Button
            component="a"
            variant="subtle"
            color="white"
            style={{
              fontWeight: 400,
              textDecoration: "underline",
              textDecorationStyle: "dashed",
              textUnderlineOffset: "8px",
              textDecorationThickness: "1.5px",
            }}
            p={0}
            m={0}
            size="md"
            onClick={() => setIsTextEnlarged((prev) => !prev)}
          >
            {isTextEnlarged ? "Read less" : "Read more"}
          </Button>
          <Divider my="sm" variant="dashed" />
        </Group>

        <Group gap={16} mt="md">
          <FeatureIcon
            value={data.eventFeatures.foodAvailable}
            label="Food Available"
            icon={<MdRestaurant size={24} />}
          />
          <FeatureIcon
            value={data.eventFeatures.smokingAllowed}
            label="Smoking Allowed"
            icon={<MdSmokingRooms size={24} />}
          />
          <FeatureIcon
            value={data.eventFeatures.wheelchairAccess}
            label="Wheelchair Access"
            icon={<MdAccessible size={24} />}
          />
          <FeatureIcon
            value={data.eventFeatures.parkingAvailable}
            label="Parking Available"
            icon={<MdLocalParking size={24} />}
          />
          <FeatureIcon
            value={data.eventFeatures.supportAvailable}
            label="Support Available"
            icon={<MdHeadset size={24} />}
          />

          <FeatureIcon
            value={data.eventFeatures.petFriendly}
            label="Pet Friendly"
            icon={<MdOutlinePets size={24} />}
          />
          <FeatureIcon
            value={data.eventFeatures.alcoholServed}
            label="Alcohol Served"
            icon={<MdLiquor size={24} />}
          />
          <FeatureIcon
            value={data.eventFeatures.ticketsAtVenue}
            label="Tickets at Venue"
            icon={<MdOutlineQrCode size={24} />}
          />
          <FeatureIcon
            value={data.eventFeatures.danceFloorAvailable}
            label="Dance Floor Available"
            icon={<DanceIcon width={24} height={24} color="white" />}
          />
          <FeatureIcon
            value={data.eventFeatures.washroomAvailable}
            label="Washroom Available"
            icon={<MdFamilyRestroom size={24} />}
          />
          <FeatureIcon
            value={data.eventFeatures.poolAvailable}
            label="Pool Available"
            icon={<MdOutlinePool size={24} />}
          />
        </Group>

        <Paper radius="lg" mt={"md"} p="8px" maw={{ base: "100%", sm: 400 }}>
          <Flex
            direction="row"
            align="center"
            justify={"space-between"}
            gap={{ base: 0, sm: "sm" }}
          >
            <Group gap={2} align="center">
              {/* // TODO: cleanup this div  */}
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
              size="sm"
              radius={"xl"}
              variant="white"
              component="a"
              c={"dark.9"}
              href={data.ticketLink}
              leftSection={<MdBookOnline size={16} fill="dark.9" />}
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
            <Group gap={GROUP_GAP} maw={100} title="Event Duration">
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

      <Accordion
        variant="contained"
        mt={"md"}
        radius={"lg"}
        classNames={classes}
        chevron={<MdArrowForwardIos size={20} />}
      >
        <Accordion.Item value="event-policy" bg="#2D2C2C">
          <Accordion.Control icon={<TbInfoTriangle />}>
            <Text size="sm" fw={"500"}>
              Venue Policy & Conditions
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <List>
              {data.policyAndConditions?.map((faq) => (
                <List.Item key={faq}>
                  <Text size="sm">{faq}</Text>
                </List.Item>
              ))}
            </List>
          </Accordion.Panel>
        </Accordion.Item>
        <Divider ml={"sm"} mr={"sm"} />
        <Accordion.Item value="print" bg="#2D2C2C">
          <Accordion.Control icon={<MdOutlineHelpOutline />}>
            <Text size="sm" fw={"500"}>
              Frequently Asked Questions
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            {data.frequentlyAskedQuestions?.length === 0 ? (
              <Text>N/A</Text>
            ) : null}
            {data.frequentlyAskedQuestions?.map((question) => (
              <div key={question.question} style={{ marginBottom: "10px" }}>
                <Group gap={GROUP_GAP} mb={4}>
                  <Text size="sm" fw={"500"}>
                    Q: {question.question}
                  </Text>
                </Group>
                <Group gap={GROUP_GAP}>
                  <Text size="sm">A: {question.answer}</Text>
                </Group>
              </div>
            ))}
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

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

      {data.joinChatDetails?.isEnabled && data.joinChatDetails?.joinChatLink ? (
        <Button
          variant="white"
          color="white"
          radius={"xl"}
          size="lg"
          component="a"
          target="_blank"
          rel="noopener noreferrer"
          href={data.joinChatDetails?.joinChatLink}
          leftSection={<MdComment fill="dark" size={20} />}
          bottom={{ base: 40, sm: 20 }}
          style={{
            position: "fixed",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
          miw={{ base: "200px" }}
        >
          <Text size="lg" fw={"500"} c={"dark"}>
            Join Chat
          </Text>
        </Button>
      ) : null}

      <Space h="60px" />

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

const FeatureIcon = ({
  value,
  icon,
  label,
}: {
  value?: boolean;
  icon: ReactNode;
  label: string;
}) => {
  const [isOpen, setIsOpened] = useState(false);

  const intervalIdRef = useRef(0);

  const onClick = useCallback(() => {
    let isNextOpened = false;
    setIsOpened((prev) => {
      isNextOpened = !prev;
      return isNextOpened;
    });

    if (isNextOpened) {
      intervalIdRef.current = setInterval(() => {
        setIsOpened(false);
      }, 2500);
    }

    return () => clearInterval(intervalIdRef.current);
  }, []);

  return (
    value && (
      <Tooltip
        label={label}
        title={label}
        opened={isOpen}
        closeDelay={2000}
        events={{ hover: false, focus: true, touch: true }}
      >
        <Center onClick={onClick}>{icon}</Center>
      </Tooltip>
    )
  );
};
