<template>
  <div class="modal-mask" v-if="visible">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <span class="modal-title">用户协议</span>
          <span class="modal-close" @click="$emit('close')">
            <span class="close-icon">×</span>
          </span>
        </div>
        <div class="modal-content">
          <slot>
            <h3>数字人平台用户协议</h3>
            <p>感谢您选择数字人平台！本协议是您与数字人平台之间关于您使用本平台服务所订立的契约。请您仔细阅读并充分理解以下全部内容，点击同意即表示您已接受本协议的全部条款。</p>
            
            <h4>一、账号注册与安全</h4>
            <ol>
              <li>您在注册时须提供真实、准确、完整的个人资料，并保证资料的及时更新。</li>
              <li>您应妥善保管账号和密码，因您个人原因导致的账号信息泄露，由您自行承担全部责任。</li>
              <li>平台有权根据实际情况，不经事先通知，暂停或终止向违反协议的用户提供部分或全部服务。</li>
            </ol>
            
            <h4>二、内容规范与知识产权</h4>
            <ol>
              <li>您通过本平台生成、发布的内容，您授予平台非独占的、全球性的、永久的、不可撤销的免费许可，允许平台储存、使用、展示您的内容，以便提供和推广平台服务。</li>
              <li>您严禁利用本平台发布、传播违反国家法律法规的内容，包括但不限于政治敏感、色情、暴力、歧视、诈骗、侵权等内容。平台有权对违法违规内容进行处理，并保留向有关部门举报的权利。</li>
              <li>您理解并同意，平台有权对您发布的内容进行审核，有权在不通知的情况下删除、屏蔽相关违规内容。</li>
              <li>如您的内容侵犯他人知识产权或其他合法权益，您将承担全部法律责任，平台有权删除相关内容并终止向您提供服务。</li>
            </ol>
            
            <h4>三、服务内容与限制</h4>
            <ol>
              <li>平台根据实际情况提供相应服务，服务内容及形式可能发生变化，平台无需事先通知。</li>
              <li>您同意平台可能会设定特定的访问限制，包括但不限于服务的访问时段、次数、频率等，并且可能随时进行调整。</li>
              <li>平台有权基于自身业务发展需要，增加、减少、调整服务种类及内容，或暂停、终止部分或全部服务。</li>
            </ol>
            
            <h4>四、收费服务与退款政策</h4>
            <ol>
              <li>平台提供的部分服务为收费服务，您使用收费服务需按照平台规定支付相应费用。</li>
              <li>您理解并同意，平台有权随时调整收费服务的收费标准及方式，并通过网站公告等方式予以明示。</li>
              <li>已付费购买的服务，除法律明确规定外，一经使用概不退款。</li>
            </ol>
            
            <h4>五、用户行为规范</h4>
            <ol>
              <li>您承诺不利用本平台从事任何违反法律法规、社会公德、平台规则的活动，包括但不限于：</li>
              <li>发布、传输含有违反国家法律法规、危害国家安全的内容；</li>
              <li>发布、传输含有侮辱、诽谤、恐吓、散布谣言或其他侵害他人合法权益的内容；</li>
              <li>发布、传输含有淫秽、色情、赌博、暴力、恐怖或者教唆犯罪的内容；</li>
              <li>利用平台进行诈骗、传销、非法集资等违法犯罪活动；</li>
              <li>干扰或破坏平台服务的正常运行，或攻击平台服务器和网络节点。</li>
            </ol>
            
            <h4>六、免责与风险承担</h4>
            <ol>
              <li>平台不对服务的及时性、安全性、准确性、可用性或持续可用性作任何承诺。</li>
              <li>您理解并同意自行承担使用本平台服务的风险，平台对服务中断或终止、数据丢失等不承担责任。</li>
              <li>平台不保证平台内容的绝对安全，不承担任何因病毒、木马、恶意程序等引起的损失。</li>
            </ol>
            
            <h4>七、协议修改与终止</h4>
            <ol>
              <li>平台有权在必要时修改本协议条款，您可以在相关页面查阅最新版本。</li>
              <li>本协议条款变更后，如果您继续使用平台服务，即视为您已接受修改后的协议。</li>
              <li>您明确同意，如您违反本协议任何条款，平台有权立即终止对您的服务，且无需通知或退还任何费用。</li>
            </ol>
            
            <p>本协议的解释、效力及纠纷的解决，适用于中华人民共和国大陆地区法律。本协议最终解释权归数字人平台所有。</p>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  visible: Boolean
})
</script>

<style scoped lang="scss">
.modal-mask {
  position: fixed;
  z-index: 9999;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(10, 25, 47, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-container {
  background: linear-gradient(135deg, rgba(18, 30, 52, 0.95) 0%, rgba(28, 38, 71, 0.95) 100%);
  border-radius: 18px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.3),
              inset 1px 1px 0px rgba(255, 255, 255, 0.1);
  width: 90vw;
  max-width: 420px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(100, 255, 218, 0.12);
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center, rgba(100, 255, 218, 0.03) 0%, transparent 70%);
    z-index: 0;
    pointer-events: none;
  }
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px 10px 22px;
  background: linear-gradient(135deg, rgba(74, 144, 226, 0.3) 0%, rgba(86, 55, 215, 0.3) 100%);
  border-bottom: 1px solid rgba(100, 255, 218, 0.15);
  position: relative;
  z-index: 1;
}
.modal-title {
  font-size: 20px;
  color: #ffffff;
  font-weight: 700;
  letter-spacing: 1px;
  text-shadow: 0 0 10px rgba(100, 255, 218, 0.4);
}
.modal-close {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(100, 255, 218, 0.15);
  transition: all 0.2s;
  
  &:hover {
    background: rgba(100, 255, 218, 0.25);
  }
  
  .close-icon {
    color: #ffffff;
    font-size: 24px;
    font-weight: 300;
    line-height: 1;
  }
}
.modal-content {
  padding: 18px 22px 22px 22px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 15px;
  line-height: 1.7;
  overflow-y: auto;
  flex: 1;
  background: transparent;
  position: relative;
  z-index: 1;
  
  h3 {
    color: rgba(100, 255, 218, 0.9);
    font-size: 18px;
    margin-bottom: 14px;
    text-shadow: 0 0 5px rgba(100, 255, 218, 0.3);
  }
  
  ol {
    margin: 10px 0 10px 18px;
    padding: 0;
    
    li {
      margin-bottom: 8px;
    }
  }
  
  p {
    margin-bottom: 10px;
  }
}
</style> 