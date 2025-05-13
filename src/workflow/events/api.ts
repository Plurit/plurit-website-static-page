import axios from "axios";
import { Env } from "src/constants";
import { EventDetail } from ".//entity";

export async function getEventDetail(eventId?: string) {
  const res = await axios({
    baseURL: Env.VITE_API_BASE_URL,
    url: `/event/${eventId}`,
    method: "GET",
  });
  return new EventDetail(res.data);
}

export async function updateLike(eventId: string, delta: number) {
  const res = await axios({
    baseURL: Env.VITE_API_BASE_URL,
    url: `/event/${eventId}/likes`,
    method: "PUT",
    data: {
      delta,
    },
  });

  return res.data;
}
