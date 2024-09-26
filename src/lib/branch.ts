import Branch from 'branch-sdk';

const options = { no_journeys: false };

export function initializeBranch() {
  return new Promise((resolve, reject) => {
    Branch.init(
      process.env.BRANCH_KEY as string,
      options,
      function (err: any, data: any) {
        if (err) {
          // console.error('Branch initialization error', err);
          reject(err);
        } else {
          // console.log('Branch initialized', data);
          resolve(data);
        }
      },
    );
  });
}

export function createBranchLink(data: any) {
  const linkData = {
    campaign: data.campaign,
    channel: 'user_generated',
    feature: 'billSummary',
    stage: 'logged_in',
    tags: ['politics', 'breaking_news', 'election_2024'],
    alias: data.alias,
    data: {
      custom_bool: true,
      custom_int: Date.now(),
      custom_string: '',
      $og_title: data.title,
      $og_description: data.description,
      $og_image_url: data.imageUrl,
      $desktop_url: data.desktopUrl,
      $uri_redirect_mode: 1,
      $deeplink_path: data.deepLinkPath,
      $ios_nativelink: true,
      $match_duration: 7200,
      $always_deeplink: true,
      $android_redirect_timeout: 750,
      $ios_url: data.androidUrl,
      $android_url: data.iosUrl,
      entity: data.customEntity,
      billId: data.billId,
      repId: data.repId,
      questionId: data.questionId,
    },
  };

  return new Promise((resolve, reject) => {
    Branch.link(linkData, function (err: any, link: any) {
      if (err) {
        reject(err);
        // debugger;
      } else {
        resolve(link);
        // debugger;
      }
    });
  });
}
