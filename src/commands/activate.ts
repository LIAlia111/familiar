import { loadState, saveState } from "../state/store.js";
import { deviceAuth } from "../sponsor/oauth.js";
import { checkSponsorStatus } from "../sponsor/check.js";
import { markSponsor } from "../sponsor/state.js";
import { GITHUB_CLIENT_ID, SPONSOR_MAINTAINER } from "../sponsor/config.js";

export async function runActivateCommand(): Promise<void> {
  const state = loadState();
  if (!state) {
    console.log("familiar 还没装宠物 —— 先运行：npx claude-familiar install");
    return;
  }

  if (GITHUB_CLIENT_ID === "Iv1.placeholder-replace-me") {
    console.log("\n✗ 此版本未配置 GitHub OAuth — 联系维护者发布正式版。\n");
    return;
  }

  console.log("\n  正在请求授权...\n");

  let token: string;
  try {
    // read:user is needed for viewer.login; read:org is needed for
    // isViewerSponsor when the sponsorship is set to private (GitHub default).
    const result = await deviceAuth(GITHUB_CLIENT_ID, ["read:user", "read:org"], (v) => {
      console.log(`  在浏览器打开: ${v.verification_uri}`);
      console.log(`  输入授权码:   ${v.user_code}\n`);
      console.log("  授权后回到这里 — 我会自动完成验证...\n");
    });
    token = result.token;
  } catch (e) {
    console.log(`✗ 授权失败: ${(e as Error).message}`);
    return;
  }

  let result;
  try {
    result = await checkSponsorStatus(token, SPONSOR_MAINTAINER);
  } catch (e) {
    console.log(`✗ 查询赞助状态失败: ${(e as Error).message}`);
    return;
  }

  const viewer = result.viewerLogin ?? "(unknown)";
  if (result.isSponsor) {
    markSponsor(state, { viewerLogin: result.viewerLogin, maintainer: SPONSOR_MAINTAINER });
    saveState(state);
    console.log(`✓ 赞助身份已验证（GitHub @${viewer} 赞助 @${SPONSOR_MAINTAINER}）`);
    console.log("  全部宠物 + 皮肤已解锁 ♥\n");
  } else {
    state.sponsorCheck = {
      isSponsor: false,
      checkedAt: Date.now(),
      viewerLogin: result.viewerLogin,
      maintainer: SPONSOR_MAINTAINER,
    };
    saveState(state);
    console.log(`  GitHub @${viewer} 暂未赞助 @${SPONSOR_MAINTAINER}`);
    console.log(`  赞助页面：https://github.com/sponsors/${SPONSOR_MAINTAINER}`);
    console.log("  赞助后再次运行 familiar activate 即可解锁。\n");
  }
}
