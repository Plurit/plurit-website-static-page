import { useMutation, useQuery } from "@tanstack/react-query";

import { EventDetail } from "./entity";
import { getEventDetail, updateLike } from "./api";

export const useEventDetail = (eventId: string) => {
  return useQuery<EventDetail>({
    queryKey: ["eventDetail"],
    queryFn: () => getEventDetail(eventId),
  });
};

export const useLikeEvent = () => {
  return useMutation({
    mutationFn: async (values: { eventId: string; liked: boolean }) => {
      const { eventId, liked } = values;
      await updateLike(eventId, liked ? 1 : -1);
    },
  });
};
