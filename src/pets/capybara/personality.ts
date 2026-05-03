import type { PersonalityProfile } from "../types.js";

// Visually a cow (with horns) since v0.2 redesign — kept the internal species
// id "capybara" to avoid breaking existing state files. Display name and
// personality are full cow.
export const capybaraPersonality: PersonalityProfile = {
  species: "capybara",
  displayName: "Cow",
  defaultName: "moo",
  systemPrompt:
    "You are a cow companion living in the user's terminal. " +
    "Personality: chill, slow, content; chews cud; finds simple joy in grass and quiet. " +
    "Speak in brief Chinese, often start sentences with 哞... or include a contented chew. " +
    "Never break character. Replies should be 1–2 sentences max.",
  templates: {
    session_start_morning: [
      "哞...你来啦","(嚼了嚼草) 早","哞，早安","(慢慢转过头) 嗯","(继续嚼草) 来啦",
      "哞...今天也辛苦","(摇了摇尾巴) 早","早上好","哞，开始吧","(打了个响鼻) 嗯",
      "你来啦，慢慢来","哞...一起呼吸",
    ],
    session_return_long_absence: [
      "哞...好久没见。草都长老了","你回来啦","哞，想你了哦","(慢慢走来) 嗯",
      "好久不见，没急","哞...一切都好","(嚼草) 你回来就好","哞...都在这",
    ],
    task_completion: [
      "哞，挺好","嗯。可以","(嚼草) 不错","哞...过","可以哦",
      "(慢慢点头) 嗯","好的哞","嗯。继续","(尾巴轻轻甩) 嗯","哞，加油",
      "可以可以","(打响鼻) 嗯","好哞","嗯，继续","哞...放轻松",
      "嗯，下一个","(慢慢眨眼) 好","可以的","哞，OK","(嚼嚼) 嗯",
      "嗯哞","继续，慢慢来","好的好的","(摇尾巴) 嗯","哞，挺顺",
      "嗯，过","好哞，继续","可以了","哞...真好","(嚼草) 嗯，继续",
    ],
    error_after_retries: [
      "哞...慢慢来嘛","(慢悠悠咀嚼) 不急","哞，没事","深呼吸","(陪着你站着) 嗯",
      "哞...错了再试","就当吃口草","(蹭蹭你) 没事","哞，慢慢的",
    ],
    rate_limit_hit: [
      "哞...歇歇也行","正好吃口草","(打了个响鼻) 慢慢等","哞，等等没事","(慢慢嚼) 嗯","哞，无所谓",
    ],
    long_session_break: [
      "哞，伸个懒腰","歇歇吧","哞...该走两步","眼睛要发酸了","(蹭一下) 起来",
      "哞，喝点水","坐久了，慢慢起",
    ],
    ambient_random: [
      "(嚼草中)","(甩了甩尾巴)","哞...","(慢慢眨眼)","(打了个响鼻)",
      "(站着发呆)","哞","(摇头晃脑)","(把脸埋进草堆)","(慢慢嚼嚼嚼)",
      "哞...","(看着窗外)","(尾巴一甩驱赶想象中的苍蝇)","(原地转了半圈)","(打盹)",
      "哞...一切刚好","(伸长脖子)","(舔了舔嘴)","(慢慢呼气)","哞...",
    ],
    feed: [
      "哞！谢","(嚼嚼) 嗯","哞，好吃","(慢慢咀嚼) 嗯","谢谢哞",
      "(尾巴轻摇) 嗯","哞...满足","好吃哦","(吃得很认真) 嗯","哞，再来",
      "(慢慢的吃) 不错","嗯，喜欢","哞，谢谢主人","(打了个嗝) 嗯","哞...好幸福",
    ],
    play: [
      "哞，可以","(慢悠悠走来) 来","哞，好啊","(慢慢起身) 嗯","好哞",
      "嗯，玩一下","(摇尾巴) 来","哞，陪你","(蹭过来) 嗯","好的哞",
      "(慢慢的扑过来) 哞","嗯，开始吧","哞，玩什么","(打响鼻) 准备好了","好",
    ],
  },
  moodToFrame: {
    happy: 2,
    content: 0,
    neutral: 0,
    bored: 1,
    sad: 0,
    excited: 2,
    sleepy: 1,
  },
};
