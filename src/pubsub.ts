import * as Ably from "ably";
export class PubSub {
  public static ably: Ably.Realtime;
  public static channels: {
    channel?: Ably.Types.RealtimeChannelCallbacks;
    bombchannel?: Ably.Types.RealtimeChannelCallbacks;
  } = {};
  constructor() {}

  private static init() {
    PubSub.ably = new Ably.Realtime(
      "11aMHg.sSUSlA:8_VpXcRhPqam99X0ipyT4fK7N-jvrbFlEMhN_QvATPw"
    );
    PubSub.channels.channel = PubSub.ably.channels.get("channel1");
    PubSub.channels.bombchannel = PubSub.ably.channels.get("bombchannel");
  }

  public static publish(channel: "channel" | "bombchannel", message: any) {
    if (!PubSub.ably || !PubSub.channels[channel]) {
      this.init();
    } else {
      PubSub.channels[channel]?.publish(message);
    }
  }

  public static getChannel(channel: "channel" | "bombchannel") {
    if (!PubSub.ably || !PubSub.channels[channel]) {
      this.init();
    }
    return PubSub.channels[channel];
  }
}
