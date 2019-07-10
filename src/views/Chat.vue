<template>
  <div class="chat">
    <scroll-view
      class="chat-list"
      scroll-y
      :scroll-top="scrollTop"
      @click="closeMenu"
      @scrolltoupper="scrolltoupper"
      :style="{height:windowHeight+'px'}"
    >
      <Loadings :loading="loading" :noneData="false" :noneMore="false"/>
      <div id="chat-content" class="chat-content" v-for="(item,index) in messageList" :key="index">
        <div class="chatList-time">{{item.data.create_time}}</div>
        <div class="chat-left" v-if="item.data.userId!=myInfo.mid">
          <div class="left-content">
            <div class="left-info">
              <div class="left-img">
                <img :src="item.data.userPhoto">
              </div>
              <div class="content-info">
                <div class="left-message">
                  <img src="../../assets/img/chat/jiantou.png" class="left-jt">
                  <template v-if="item.data.msgType=='msg_text'">
                    <span v-for="(list,index2) in item.data.info.text" :key="index2">
                      <template v-if="!list.isBrow">{{list.text}}</template>
                      <img :src="list.brow" v-else class="brow-img">
                    </span>
                  </template>
                  <img
                    src="../../assets/img/chat/voice_other.png"
                    v-if="item.type=='voice'"
                    @click="openVoice(item.msgContent,index)"
                    class="voiceImg"
                  >
                  <img
                    :src="item.data.info.imgUrl_ORIGIN"
                    v-if="item.data.msgType=='msg_picture'"
                    mode="widthFix"
                    style="width:100px"
                    class="recordImg"
                    @click="previewImage(item)"
                  >
                </div>
              </div>
              <div class="acceptStatus-img">
                <img
                  src="https://bst-routine-1256880008.cos.ap-chengdu.myqcloud.com/img/bst/loading.gif"
                  class="loadingImg"
                  v-if="item.isWait"
                >
                <img src="../../assets/img/chat/fail.png" class="loadingImg" v-if="!item.isSend">
                <span
                  v-if="item.msgType=='msg_voice'&&!item.isWait&&item.isSend"
                  class="voiceTime"
                >{{item.voiceDuration}}"</span>
              </div>
            </div>
          </div>
        </div>
        <div class="chat-right" v-else>
          <div class="right-content">
            <div class="right-info">
              <div class="content-info">
                <div class="sendStatus-img">
                  <img
                    src="https://bst-routine-1256880008.cos.ap-chengdu.myqcloud.com/img/bst/loading.gif"
                    class="loadingImg"
                    v-if="item.isWait"
                  >
                  <img src="../../assets/img/chat/fail.png" class="loadingImg" v-if="!item.isSend">
                  <span
                    v-if="item.msgType=='msg_voice'&&!item.isWait&&item.isSend"
                    class="voiceTime"
                  >{{item.voiceDuration}}"</span>
                </div>
                <div class="right-message" :class="{messageBg:item.type=='brow'}">
                  <img
                    src="../../assets/img/chat/jiantou.png"
                    class="right-jt"
                    v-if="item.type!='brow'"
                  >
                  <template v-if="item.data.msgType=='msg_text'">
                    <span v-for="(list,index2) in item.data.info.text" :key="index2">
                      <template v-if="!list.isBrow">{{list.text}}</template>
                      <img :src="list.brow" v-else class="brow-img">
                    </span>
                  </template>
                  <img
                    src="../../assets/img/chat/voice_mine.png"
                    v-if="item.type=='voice'"
                    @click="openVoice(item.msgContent,index)"
                    class="voiceImg"
                  >
                  <img
                    :src="item.data.info.imgUrl_ORIGIN"
                    v-if="item.data.msgType=='msg_picture'"
                    mode="widthFix"
                    style="width:100px"
                    class="recordImg"
                    @click="previewImage(item)"
                  >
                </div>
              </div>
              <div class="right-img">
                <img :src="item.data.userPhoto">
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroll-view>
    <div id="chat-menu">
      <div class="chat-menu">
        <div class="chat-item">
          <div class="menu-left">
            <img
              src="../../assets/img/chat/keyboard.png"
              class="chat-icon1"
              v-if="voiceFlag"
              @click="voiceFlag=!voiceFlag"
            >
            <img
              src="../../assets/img/chat/recording.png"
              class="chat-icon1"
              v-else
              @click="voiceFlag=!voiceFlag"
            >
          </div>
          <div class="menu-center">
            <div v-if="voiceFlag" class="voice-btn" @longpress="longpress" @touchend="touchend">按住说话</div>
            <div v-else class="chat-input">
              <input
                type="text"
                cursor-spacing="20"
                v-model="text"
                @input="inputValue"
                @blur="blurInput"
                @comfirm="sendMsg(text)"
              >
              <img src="../../assets/img/chat/smile.png" class="chat-icon1" @click="switchBrow">
            </div>
          </div>
          <div class="menu-right">
            <span class="send" @click="sendMsg(text)" v-if="sendStatus">发送</span>
            <i class="iconfont icon-tianjia addImg" @click="switchPhoto" v-else></i>
          </div>
        </div>
      </div>
      <div class="menu-content" v-if="photoFlag">
        <div class="photo" @click="chooseImg('album')">
          <p class="photo-icon">
            <img src="../../assets/img/chat/video.png" class="chat-icon2">
          </p>
          <p class="title">照片</p>
        </div>
        <div class="shooting" @click="chooseImg('camera')">
          <p class="shooting-icon">
            <img src="../../assets/img/chat/shooting.png" class="chat-icon2">
          </p>
          <p class="title">拍摄</p>
        </div>
      </div>
      <swiper
        v-if="browFlag"
        :vertical="false"
        class="swiper"
        :circular="true"
        indicator-dots
        indicator-active-color="#00b600"
        indicator-color="#888888"
      >
        <block v-for="(item,index) in browList" :key="index">
          <swiper-item>
            <div class="menu-content brow-content" scroll-x>
              <div class="brow" v-for="(list,index2) in item" :key="index2" @click="sendBrow(list)">
                <img :src="list.imgSrc" class="brow-img">
              </div>
            </div>
          </swiper-item>
        </block>
      </swiper>
    </div>
    <div class="recordVoice" v-if="recordingFlag">
      <div class="recording">
        <img src="../../assets/img/chat/voice.png" class="recording-img">
        <span>00:{{voice.time==0?"00":voice.time}}</span>
        <span>正在录音</span>
      </div>
    </div>
  </div>
</template>
<script>
import webim from "@/lib/webim_wx";
import { showToast, showBusy } from "@/utils/pointDialog";
import { withData } from "@/utils/dateTime";
import api, { upyun } from "@/api/index";
import { getTimeDate } from "@/utils/util";
import { getArray } from "@/utils/public";
import Loadings from "@/components/common/Loadings";
import common from "@/utils/common";
import { webimLogin } from "../../utils/chat";
import { brows as browList, textList } from "../../utils/brow.js";
const record = wx.getRecorderManager(); //录音
const audio = wx.createInnerAudioContext(); //播放录音
export default {
  components: { Loadings },
  data() {
    return {
      voiceFlag: false, //切换语音
      browList: getArray(browList, 50), //表情列表
      browFlag: false, //切换表情
      photoFlag: false, //切换拍照
      img: "", //展示图片
      sendStatus: false, //切换发送按钮
      text: "", //输入文本值
      recordingFlag: false, //录音中
      voice: {
        startTime: null, //录音开始时间
        endStartTime: null, //录音结束时间
        file: "", //录音文件
        time: 0 //录音时长
      },
      timer: "",
      noneMore: false,
      loading: false, //下拉分页加载
      loadingFlag: false, //加载中
      failFlag: false, //发送失败
      windowHeight: null, //窗口宽高
      messageList: [], //消息列表
      scrollTop: null, //滚动位置
      activeVoice: "",
      myInfo: "", //用户id
      myLevel: "",
      UserSig: "", //用户登录IM唯一鉴权
      cpInfo: "", //联系人cp信息
      userLevel: "", //联系人称号信息
      prePageC2CHistroyMsg: { LastMsgTime: 0, MsgKey: "" } //存放拉取下次历史消息参数
    };
  },
  methods: {
    //打开录音
    openVoice(mp3, index) {
      let voiceTime = this.messageList[index].voiceDuration;
      clearInterval(timer);
      audio.autoplay = true;
      audio.src = mp3;
      let timer = setInterval(() => {
        this.messageList[index].voiceDuration--;
        if (this.messageList[index].voiceDuration < 0) {
          audio.stop();
          this.messageList[index].voiceDuration = voiceTime;
          clearInterval(timer);
        }
      }, 1000);
      audio.onStop(res => {
        showToast("播放结束");
        return;
      });
    },
    //关闭弹出部分
    closeMenu() {
      this.photoFlag = false;
      this.browFlag = false;
    },
    //选择表情
    switchBrow() {
      this.browFlag = !this.browFlag;
      this.photoFlag = false;
    },
    //选择图片或者拍摄
    switchPhoto() {
      this.browFlag = false;
      this.photoFlag = !this.photoFlag;
    },
    //输入事件
    inputValue() {
      if (!this.text.replace(/^\s*|\s*$/g, "")) return;
      this.sendStatus = this.text == "" ? false : true;
    },
    //发送文本消息
    sendMsg(text) {
      if (!text.replace(/^\s*|\s*$/g, "")) return;
      this.sendCustomMsg({ text }, text, "msg_text");
      this.text = "";
      this.photoFlag = false;
      this.browFlag = false;
      this.sendStatus = false;
    },
    //发送表情图片
    sendBrow(list) {
      this.sendStatus = true;
      this.text += list.text;
    },
    setScroll() {
      setTimeout(() => {
        let query = wx.createSelectorQuery();
        query
          .selectAll("#chat-content")
          .boundingClientRect(rect => {
            if (rect.length != 0) {
              this.scrollTop = rect[rect.length - 1].top;
            }
          })
          .exec();
      }, 50);
    },
    //按住
    longpress() {
      console.log("按住了");
      record.start({
        duration: 6000,
        sampleRate: 44100,
        numberOfChannels: 1,
        encodeBitRate: 192000,
        format: "mp3"
      });
      record.onStart(() => {
        console.log("开始了");
        clearInterval(this.timer);
        this.recordingFlag = true;
        this.voice.startTime = new Date().getTime();
        let num = 0;
        this.timer = setInterval(() => {
          num++;
          this.voice.time = withData(num);
        }, 1000);
      });
    },
    //录音结束
    touchend() {
      record.stop();
      this.voice.endTime = new Date().getTime();
      record.onStop(res => {
        this.recordingFlag = false;
        clearInterval(this.timer);
        this.voice.time = 0;
        let time = new Date(
          this.voice.endTime - this.voice.startTime
        ).getSeconds();
        if (time < 1) {
          return;
        }
        if (time >= 60 || time >= 1) {
          showToast("录音完毕");
          upyun.upload({
            localPath: res.tempFilePath,
            remotePath: "/wxRecord/",
            name: "file",
            success: response => {
              let voiceUrl =
                "http://images.lexbst.com" + JSON.parse(response.data).url;
              let info = { voiceUrl, voiceSecond: time };
              this.sendCustomMsg(info, voiceUrl, "msg_voice");
            },
            fail: err => {
              showToast("上传失败");
            }
          });
        }
      });
    },
    //选择/拍摄照片
    chooseImg(sourceType) {
      wx.chooseImage({
        count: 1,
        sourceType: [sourceType], //album 从相册选图，camera 使用相机
        sizeType: ["compressed "],
        success: res => {
          upyun.upload({
            localPath: res.tempFilePaths[0],
            remotePath: "/wxImage/",
            name: "file",
            success: response => {
              let url =
                "http://images.lexbst.com" + JSON.parse(response.data).url;
              console.log(url);
              wx.getImageInfo({
                src: url,
                success: res => {
                  let info = {
                    imgUrl_ORIGIN: url,
                    imgUrl_THUMB: "",
                    imgUrl_LARGE: "",
                    imgWidth: res.width,
                    imgHeight: res.height
                  };
                  this.sendCustomMsg(info, url, "msg_picture");
                }
              });
            }
          });
        }
      });
    },
    //图片预览
    previewImage(item) {
      wx.previewImage({
        urls: [item.data.info.imgUrl_ORIGIN]
      });
    },
    //发送自定义消息
    sendCustomMsg(info, desc, msgType) {
      let cpInfo = this.cpInfo;
      let userLevel = this.userLevel;
      let myLevel = this.myLevel;
      let myInfo = this.myInfo;
      const data = {
        msgType,
        sourceType: "friendMessage",
        userId: myInfo.mid,
        userName: myInfo.cp_username,
        peerUserId: cpInfo.mid,
        peerUserName: cpInfo.cp_username,
        userPhoto: myInfo.avatar,
        peerUserPhoto: cpInfo.avatar,
        timestamp: new Date().getTime() / 1000,
        levelName: {
          userSignName: myLevel.name,
          peerUserSignLevel: userLevel.level,
          peerUserSignName: userLevel.name,
          userSignLevel: myLevel.level
        },
        info
      };
      let session = new webim.Session(
        webim.SESSION_TYPE.C2C,
        cpInfo.mid,
        cpInfo.cp_username,
        cpInfo.avatar,
        new Date().getTime() / 1000
      );
      let msg = new webim.Msg(
        session,
        true,
        -1,
        -1,
        -1,
        myInfo.mid,
        webim.C2C_MSG_SUB_TYPE,
        myInfo.cp_username
      );
      let Desc;
      switch (msgType) {
        case "msg_text":
          Desc = `${data.userName}发来了一条私信`;
          break;
        case "msg_picture":
          Desc = `${data.userName}发来了一段语音`;
          break;
        case "msg_voice":
          Desc = `${data.userName}发来了一张图片`;
          break;
      }
      msg.PushInfo = {
        PushFlag: 0,
        Desc,
        Ext: "百事通来私信喽",
        AndroidInfo: { Sound: "android.mp3" },
        ApnsInfo: {
          Sound: "apns.mp3",
          BadgeMode: 1,
          Title: info.text,
          SUbTitle: "",
          Image: ""
        }
      };
      msg.PushInfoBoolean = true;
      msg.sending = 1;
      msg.originCOntent = data.text;
      let customObj = new webim.Msg.Elem.Custom(
        JSON.stringify(data),
        desc,
        msgType
      );
      msg.addCustom(customObj);
      let msgInfo = JSON.parse(msg.elems[0].content.data);
      let param = {
        isWait: true,
        ...this.createMsg(msg, msgInfo)
      };
      this.messageList.push(param);
      this.text = "";
      this.setScroll();
      webim.sendMsg(
        msg,
        res => {
          param.isWait = false;
          if (res.ErrorCode === 0) {
            param.isSend = true;
          } else {
            param.isSend = false;
          }
        },
        err => {
          param.isWait = false;
          param.isSend = false;
        }
      );
    },
    createMsg(item, data) {
      console.log(data);
      try {
        data.create_time = getTimeDate(new Date(data.timestamp * 1000));
      } catch (error) {
        data.create_time = data.timestamp;
      }
      if (data.msgType === "msg_text") {
        data.info.text = textList(data.info.text);
      }
      return {
        data,
        fromAccount: item.fromAccount,
        fromAccountHeadurl: item.fromAccountHeadurl,
        fromAccountNick: item.fromAccountNick,
        isSend: item.isSend,
        subType: item.subType,
        time: item.time
      };
    },
    //历史消息分页
    scrolltoupper() {
      if (this.noneMore) return;
      this.loading = true;
      this.getLastC2CHistoryMsgs(resp => {
        this.loading = false;
        let list = resp.map(item => {
          let data = JSON.parse(item.elems[0].content.data);
          if (data.sourceType === "friendMessage") {
            item.isSend = true;
            return {
              isWait: false,
              ...this.createMsg(item, data)
            };
          }
        });
        this.messageList = list.concat(this.messageList);
        this.scrollTop = 0;
        console.log(this.messageList);
      });
    },
    //获取最新的 C2C 历史消息,用于切换好友聊天，重新拉取好友的聊天消息
    getLastC2CHistoryMsgs(cbOk, cbError) {
      let info = this.cpInfo;
      let { LastMsgTime, MsgKey } = this.prePageC2CHistroyMsg;
      var options = {
        Peer_Account: info.mid, //好友帐号
        MaxCnt: 10, //拉取消息条数
        LastMsgTime, //最近的消息时间，即从这个时间点向前拉取历史消息
        MsgKey
      };
      webim.getC2CHistoryMsgs(options, resp => {
        var complete = resp.Complete; //是否还有历史消息可以拉取，1-表示没有，0-表示有
        var retMsgCount = resp.MsgCount; //返回的消息条数，小于或等于请求的消息条数，小于的时候，说明没有历史消息可拉取了
        if (resp.MsgList.length == 0) {
          this.loading = false;
          this.noneMore = true;
          return;
        }
        this.prePageC2CHistroyMsg = {
          //保留服务器返回的最近消息时间和消息Key,用于下次向前拉取历史消息
          LastMsgTime: resp.LastMsgTime,
          MsgKey: resp.MsgKey
        };
        if (cbOk) cbOk(resp.MsgList);
      });
    }
  },
  onLoad(options) {
    let { mid, cpName } = JSON.parse(options.param);
    this.setNavigationBar(`正在和${cpName}聊天`, "#ffffff", "#416ce3");
    this.noneMore = false;
    //获取屏幕宽高
    common.getListInfo(res => {
      this.windowHeight = res.hh - res.height;
    }, 50);
    let userInfo = wx.getStorageSync("userInfo");
    api
      .personalInfo({ mid })
      .then(res => {
        this.cpInfo = res.info.data;
        this.userLevel = res.info.userLevel;
        return api.personalInfo({ mid: userInfo.id });
      })
      .then(res => {
        this.myInfo = res.info.data;
        this.myLevel = res.info.userLevel;
        webimLogin(
          res => {
            this.loading = true;
            this.getLastC2CHistoryMsgs(resp => {
              this.loading = false;
              resp.forEach(item => {
                let data = JSON.parse(item.elems[0].content.data);
                if (data.sourceType === "friendMessage") {
                  item.isSend = true;
                  this.messageList.push({
                    isWait: false,
                    ...this.createMsg(item, data)
                  });
                }
              });
              this.setScroll();
            });
          },
          newMsgList => {
            let selToID = this.cpInfo.mid,
              selSess = null;
            var sess, newMsg;
            var sessMap = webim.MsgStore.sessMap(); //获取所有聊天会话
            for (var j in newMsgList) {
              //遍历新消息
              newMsg = newMsgList[j];
              if (newMsg.getSession().id() == selToID) {
                selSess = newMsg.getSession(); //为当前聊天对象的消息
                let data = JSON.parse(newMsg.elems[0].content.data);
                newMsg.isSend = true;
                let param = {
                  isWait: false,
                  ...this.createMsg(newMsg, data)
                };
                this.messageList.push(param); //在聊天窗体中新增一条消息
                this.setScroll();
              }
            }
            webim.setAutoRead(selSess, true, true); //消息已读上报，以及设置会话自动已读标记
          }
        );
      });
  }
};
</script>
<style scoped>
#chat-menu {
  position: fixed;
  width: 100%;
  bottom: 0;
  z-index: 99999;
}
.chat-menu {
  height: 50px;
  background: #f5f5f9;
}
.chat-item {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 5px;
}
.swiper {
  height: 200px;
  background: #fff;
}
.menu-center {
  flex: 1;
  position: relative;
  height: 35px;
  line-height: 35px;
  background: #fff;
  padding: 0 30px 0 10px;
}
.menu-left,
.menu-right {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
}
.menu-left i,
.chat-input i {
  font-size: 20px;
}
.chat-input input,
.chat-input,
.voice-btn {
  height: 100%;
  width: 100%;
}
.voice-btn {
  text-align: center;
}
.chat-input img {
  position: absolute;
  right: 5px;
  top: 3px;
}
.menu-content {
  display: flex;
  height: 200px;
  background: #f5f5f9;
  box-sizing: border-box;
  padding: 12px 12px 25px 12px;
}
.photo,
.shooting {
  margin-right: 20px;
}
.photo i,
.shooting i {
  color: #888888;
}
.photo-icon,
.shooting-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 5px;
  background: #fff;
}
.photo .title,
.shooting .title {
  height: 25px;
  line-height: 25px;
  text-align: center;
}
.addImg {
  color: #bfbfbf;
  font-size: 24px;
}
.send {
  position: absolute;
  display: inline-block;
  width: 35px;
  font-size: 12px;
  height: 20px;
  line-height: 20px;
  color: #fff;
  text-align: center;
  background: green;
  border-radius: 3px;
}
.brow-content {
  display: flex;
  flex-wrap: wrap;
  background: #fff;
}
.brow {
  width: 10%;
  height: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.brow-img {
  width: 30px;
  height: 30px;
}
.chat-list {
  overflow: scroll;
  margin-bottom: 50px;
}
.chatList-time {
  margin-top: 60rpx;
  background-color: #cccccc;
  color: white;
  padding: 8rpx 10rpx 6rpx 10rpx;
  border-radius: 6rpx;
  width: auto;
  font-size: 22rpx;
  line-height: 22rpx;
  text-align: center;
}
.sendStatus-img,
.acceptStatus-img {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}
.chat-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 12px;
}
.chat-right {
  display: flex;
  justify-content: flex-end;
}
.chat-right,
.chat-left {
  width: 100%;
  padding: 10px 0;
  box-sizing: border-box;
}
.left-img img,
.right-img img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
.voiceImg {
  width: 15px;
  height: 20px;
}
.right-info,
.left-info {
  display: flex;
}
.left-message {
  margin-left: 10px;
  position: relative;
}
.left-jt,
.right-jt {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 3px;
}
.left-jt {
  left: -6px;
  transform: rotate(-90deg);
}
.right-jt {
  right: -6px;
}
.content-info {
  display: flex;
  align-items: center;
  justify-content: center;
}
.browImg {
  width: 60px;
  height: 60px;
}
.left-message,
.right-message {
  background: #63b1f1;
  font-size: 14px;
  padding: 5px 12px;
  border-radius: 5px;
}
.right-message {
  flex-wrap: wrap;
  max-width: 300px;
  line-height: 30px;
  margin-right: 10px;
  position: relative;
}
.messageBg {
  background: #fff;
}
.loadingImg {
  position: relative;
  margin: 10px;
  top: 5px;
  width: 15px;
  height: 15px;
}
.voiceTime {
  position: relative;
  top: 5px;
}
.mark {
  color: red;
}
.recordVoice {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 100px;
  height: 100px;
  border-radius: 5px;
  background: #817f7f;
  opacity: 0.8;
  color: #fff;
  padding: 10px;
  box-sizing: border-box;
}
.recording {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.recording-img {
  width: 50px;
  height: 50px;
}
.chat-icon1 {
  width: 28px;
  height: 28px;
}
.chat-icon2 {
  width: 32px;
  height: 32px;
}
</style>
