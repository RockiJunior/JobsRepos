import { EnumRankType } from 'src/common/constants';

const cron = require('node-cron');
const axios = require('axios');

const { AUTH_TOKEN, HOST } = process.env;

export const cronService = async () => {
  const taskAssociates = cron.schedule('0 1 * * *', async () => {
    await axios.get(`${HOST}reportsCms/associates/cron`, {
      headers: {
        authorization: AUTH_TOKEN,
      },
    });
    console.log('Cron associates triggered');
  });

  const taskActivity = cron.schedule('0 1 * * 2', async () => {
    await axios.get(`${HOST}reportsCms/activity/cron`, {
      headers: {
        authorization: AUTH_TOKEN,
      },
    });
    console.log('Cron activity triggered');
  });

  const taskScore = cron.schedule('0 1 1 Jan,May,Sep 2', async () => {
    await axios.get(`${HOST}reportsCms/score/cron`, {
      headers: {
        authorization: AUTH_TOKEN,
      },
    });
    console.log('Cron commiss triggered');
  });

  const taskCommiss = cron.schedule('0 1 * * 2', async () => {
    await axios.get(`${HOST}reportsCms/commiss/cron`, {
      headers: {
        authorization: AUTH_TOKEN,
      },
    });
    console.log('Cron commiss triggered');
  });

  const deleteAccounts = cron.schedule('0 1 * * 2', async () => {
    await axios.get(`${HOST}onboarding/deleteAccountCron`, {
      headers: {
        authorization: AUTH_TOKEN,
      },
    });
    console.log('Cron deleteAccounts triggered');
  });

  const taskGenerateReports = cron.schedule('0 1 * * 2', async () => {
    await axios.get(`${HOST}movements/generateReportsCron`, {
      headers: {
        authorization: AUTH_TOKEN,
      },
    });
    console.log('Cron generateReports triggered');
  });

  const generateindividualRanking = cron.schedule('0 1 1 Jan,May,Sep 2', async () => {
    await axios.get(`${HOST}movements/individualRankingCron`, {
      headers: {
        authorization: AUTH_TOKEN,
      },
    });
    console.log('Cron individualRanking triggered');
  });

  const generateLeaderShipRanking = cron.schedule('0 1 1 Jan,Mar,May,Jul,Sep,Nov 2', async () => {
    await axios.get(`${HOST}movements/leadershipRankingCron`, {
      headers: {
        authorization: AUTH_TOKEN,
      },
    });
    console.log('Cron leadershipRanking triggered');
  });

  const generateIndividualCommission = cron.schedule('0 1 * * 2', async () => {
    await axios.get(`${HOST}commissions/generateIndividualCron`, {
      headers: {
        authorization: AUTH_TOKEN,
      },
    });
    console.log('Cron individualCommission triggered');
  });

  const generateLeaderShipCommission = cron.schedule('0 1 * * 2', async () => {
    await axios.get(`${HOST}commissions/generateLeaderShipCron`, {
      headers: {
        authorization: AUTH_TOKEN,
      },
    });
    console.log('Cron leadershipCommission triggered');
  });

  const generateMonthlyBonus = cron.schedule('0 1 * * 2', async () => {
    await axios.get(`${HOST}commissions/generateMonthlyBonusCron`, {
      headers: {
        authorization: AUTH_TOKEN,
      },
    });
    console.log('Cron monthlyGoal triggered');
  });

  const generateMonthlyGoal = cron.schedule('0 1 * * 2', async () => {
    await axios.get(`${HOST}commissions/generateMonthlyGoalCron`, {
      headers: {
        authorization: AUTH_TOKEN,
      },
    });
    console.log('Cron monthlyGoal triggered');
  });

  const generateRankingWeekly = cron.schedule('0 1 * * 2', async () => {
    await axios.get(`${HOST}movements/generateRanking/${EnumRankType.WEEKLY}`, {
      headers: {
        authorization: AUTH_TOKEN,
      },
    });
    console.log('Cron rankingWeekly triggered');
  });

  const generateRankingMonthly = cron.schedule('0 1 1 * 2', async () => {
    await axios.get(`${HOST}movements/generateRanking/${EnumRankType.MONTHLY}`, {
      headers: {
        authorization: AUTH_TOKEN,
      },
    });
    console.log('Cron rankingMonthly triggered');
  });

  const generateRankingBiMonthly = cron.schedule('0 1 1 Jan,Mar,May,Jul,Sep,Nov 2', async () => {
    await axios.get(`${HOST}movements/generateRanking/${EnumRankType.BIMONTHLY}`, {
      headers: {
        authorization: AUTH_TOKEN,
      },
    });
    console.log('Cron rankingBimonthly triggered');
  });

  const disableUnfinishedPartner = cron.schedule('0 1 * * *', async () => {
    await axios.get(`${HOST}partners/disableUnfinishedPartner`, {
      headers: {
        authorization: AUTH_TOKEN,
      },
    });
    console.log('Cron rankingBimonthly triggered');
  });

  await taskGenerateReports.start();
  await generateindividualRanking.start();
  await generateLeaderShipRanking.start();
  await generateIndividualCommission.start();
  await generateLeaderShipCommission.start();
  await generateMonthlyBonus.start();
  await generateMonthlyGoal.start();
  await generateRankingWeekly.start();
  await generateRankingMonthly.start();
  await generateRankingBiMonthly.start();
  await taskActivity.start();
  await taskAssociates.start();
  await taskCommiss.start();
  await taskScore.start();
  await deleteAccounts.start();
  await disableUnfinishedPartner.start();
};
