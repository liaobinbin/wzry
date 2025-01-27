import { defineStore } from "pinia";
import { ref } from "vue";

import settingStore from "./setting";

import { TOOL, AudioVisual } from "@/utils";

/** @description 音乐播放器 */
const musicStore = defineStore("music", () => {
  let progress_timer: Interval; //进度条宽度设置
  let tool_timer: Interval; //工具显示设置
  const bgmIndex = ref(0); //音乐索引
  const progress = ref(0); //播放进度
  const volume = ref(0); //音量
  const status = ref(false); //当前音乐播放状态，false:暂停
  const show_list = ref(false); //显示播放列表
  const show_tool = ref(true); //显示工具栏
  const bgm = ref(new Audio()); //播放器

  const audio_visual = ref<AudioVisual>();
  const musics = [
    { name: "云宫迅音", url: "ygxy", time: "00:02:55" },
    { name: "永远的长安城", url: "cac", time: "00:02:42" },
    { name: "英雄归来", url: "yxgl", time: "00:03:03" },
    { name: "王者诸将", url: "wzzj", time: "00:03:31" },
    { name: "王者战歌", url: "wzzg", time: "00:02:41" },
    { name: "王者登陆", url: "wzdl", time: "00:03:14" },
    { name: "王者出征", url: "wzcz", time: "00:04:07" },
    { name: "王者冰刃", url: "wzbr", time: "00:04:07" },
    { name: "荣耀主题", url: "ryzt", time: "00:03:36" },
    { name: "荣耀之路", url: "ryzl", time: "00:08:06" },
    { name: "冠军杯", url: "gjb", time: "00:03:33" },
  ]; //音乐列表

  musics.sort(() => 0.5 - Math.random()); //打乱顺序
  bgm.value.setAttribute("crossOrigin", "anonymous"); //允许音频可视化跨域

  /** @description 上一首 */
  const last = () => {
    //如果为第一首，则最后一首开始播放
    if (bgmIndex.value === 0) {
      bgmIndex.value = musics.length;
    }
    playIndex(bgmIndex.value - 1);
  };

  /**
   * @description: 播放音乐
   * @param isReset 是否播放下一首
   */
  const play = (isNext = true) => {
    if (isNext) {
      bgm.value.src = `${IMGBED}/music/${musics[bgmIndex.value].url}.mp3`;
    }

    status.value = true;
    bgm.value.volume = volume.value;

    bgm.value
      .play()
      .then(() => {
        //播放成功后开始分析音频
        audio_visual.value?.play();
        //如果未启用音乐播放器，则暂停播放
        if (!settingStore().config.music) {
          bgm.value.pause();
        }
      })
      .catch(() => {
        setTimeout(() => {
          play(false);
        }, 1000);
      });

    //实时设置播放进度
    progress_timer = setInterval(() => {
      progress.value = TOOL.potEoPct(bgm.value.currentTime / bgm.value.duration);
    }, 500);

    //播放结束后执行下一次播放
    bgm.value.onended = next;
  };

  /** @description 暂停 */
  const pause = () => {
    status.value = false;
    bgm.value.pause();
    clearInterval(progress_timer);
  };

  /** @description 下一首 */
  const next = () => {
    //如果为最后一首，则下一首从第一首开始播放
    bgmIndex.value += 1;
    if (bgmIndex.value === musics.length) {
      bgmIndex.value = 0;
    }
    playIndex(bgmIndex.value);
  };

  /**
   * @description: 设置播放进度
   * @param v 0-1保留两位小数
   */
  const setCurrentTime = (v: number) => {
    bgm.value.currentTime = bgm.value.duration * v;
  };

  /** @description 显示播放列表 */
  const list = () => {
    show_list.value = !show_list.value;
  };

  /**
   * @description: 播放指定音乐
   * @param index 音乐音乐索引号
   */
  const playIndex = (index: number) => {
    progress.value = 0;
    bgmIndex.value = index;
    play();
  };

  /** @description 显示工具栏 */
  const showTool = (v: boolean) => {
    clearTimeout(tool_timer);
    if (v) {
      show_tool.value = v;
    } else {
      show_list.value = v;
      tool_timer = setTimeout(() => {
        show_tool.value = v;
      }, 250);
    }
  };

  /**
   * @description: 音量调节
   * @param v 0-100
   */
  const setVolume = (v: number) => {
    volume.value = (v / 100) * 0.25;
    bgm.value.volume = volume.value;
  };

  /** @description 停止播放 */
  const stop = () => {
    bgm.value.pause();
    bgm.value.currentTime = 0;
  };

  /** @description 音频可视化初始化 */
  const initAudioVisual = (canvas: HTMLCanvasElement) => {
    audio_visual.value = new TOOL.AudioVisual(bgm.value, canvas);
  };

  /** @description 重新创建播放器，解决音乐可视化音频标签被占用问题 */
  const resetAudio = () => {
    bgm.value = new Audio();
    bgm.value.setAttribute("crossOrigin", "anonymous"); //允许音频可视化跨域
  };

  return {
    /** 音频元素 */
    bgm,
    /** 当前音乐播放状态，false:暂停 */
    status,
    /** 音乐索引 */
    bgmIndex,
    /** 播放进度 */
    progress,
    /** 显示播放列表 */
    show_list,
    /** 显示工具栏 */
    show_tool,
    /** 音乐列表 */
    musics,
    last,
    play,
    pause,
    next,
    list,
    setCurrentTime,
    playIndex,
    showTool,
    setVolume,
    stop,
    resetAudio,
    initAudioVisual,
  };
});

export default musicStore;
export type MusicStore = ReturnType<typeof musicStore>;
