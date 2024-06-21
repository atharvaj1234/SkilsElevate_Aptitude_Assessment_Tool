const getBadgeData = (percentage) => {
  if (percentage >= 75) {
    return {
      badgeUrl:
        "https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/Badges%2FBeginner%2FScholar.png?alt=media&token=f66cd703-5c7f-4a02-b6d8-d3b821b9f885",
      badgeValue: 100,
    };
  } else if (percentage >= 50) {
    return {
      badgeUrl:
        "https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/Badges%2FBeginner%2FLearner.png?alt=media&token=07a01ab5-25f7-4648-811c-bfae551ef9a6",
      badgeValue: 75,
    };
  } else if (percentage >= 25) {
    return {
      badgeUrl:
        "https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/Badges%2FBeginner%2FRookie.png?alt=media&token=4904c82e-1e23-477d-a152-650e5d2cae2b",
      badgeValue: 50,
    };
  } else {
    return {
      badgeUrl:
        "https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/Badges%2FBeginner%2FBeginner.png?alt=media&token=8bec5e34-39c6-402c-b8e0-954d4845baf6",
      badgeValue: 25,
    };
  }
};

const getProfileBadgeData = (user) => {
  const profileScore = user?.profilescore;
  const ranges = [
    { min: 1900, max: 2000, url: "url1" },
    {
      min: 1700,
      max: 1900,
      url: "https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/Badges%2FProfileBadges%2Fh5.png?alt=media&token=28c506b7-5ec5-41b9-8dbd-2c64fa7bad32",
    },
    {
      min: 1500,
      max: 1700,
      url: "https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/Badges%2FProfileBadges%2Fh4.png?alt=media&token=9f4654a8-cac8-4213-9b0d-a8855e7c6226",
    },
    {
      min: 1300,
      max: 1500,
      url: "https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/Badges%2FProfileBadges%2Fh3.png?alt=media&token=440ddcc8-35fa-4cea-8549-163c994e1c4a",
    },
    {
      min: 1100,
      max: 1300,
      url: "https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/Badges%2FProfileBadges%2Fh2.png?alt=media&token=d5ae1dbb-6f8b-4b96-8fc8-b7c2023d70b1",
    },
    {
      min: 1000,
      max: 1100,
      url: "https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/Badges%2FProfileBadges%2Fh1.png?alt=media&token=0c507994-f9b0-4bf4-b78a-9e76c467a6bc",
    },
    {
      min: 900,
      max: 1000,
      url: "https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/Badges%2FProfileBadges%2Fi4.png?alt=media&token=f34ae6e6-1959-4a36-bd33-8b9e199af3e3",
    },
    {
      min: 800,
      max: 900,
      url: "https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/Badges%2FProfileBadges%2Fi3.png?alt=media&token=b94c7c6f-9f87-4da3-83a4-ebb778f27009",
    },
    {
      min: 700,
      max: 800,
      url: "https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/Badges%2FProfileBadges%2Fi2.png?alt=media&token=04bfd94c-c498-4e46-9902-a0334d2e021e",
    },
    {
      min: 600,
      max: 700,
      url: "https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/Badges%2FProfileBadges%2F1.png?alt=media&token=df4f6c3b-b1cf-4c0c-9f2c-ab51e99a8b83",
    },
    { min: 500, max: 600, url: "url10" },
    {
      min: 400,
      max: 500,
      url: "https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/Badges%2FBeginner%2FScholar.png?alt=media&token=f66cd703-5c7f-4a02-b6d8-d3b821b9f885",
    },
    {
      min: 300,
      max: 400,
      url: "https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/Badges%2FBeginner%2FLearner.png?alt=media&token=07a01ab5-25f7-4648-811c-bfae551ef9a6",
    },
    {
      min: 200,
      max: 300,
      url: "https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/Badges%2FBeginner%2FRookie.png?alt=media&token=4904c82e-1e23-477d-a152-650e5d2cae2b",
    },
    {
      min: 100,
      max: 200,
      url: "https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/Badges%2FBeginner%2FBeginner.png?alt=media&token=8bec5e34-39c6-402c-b8e0-954d4845baf6",
    },
    {
      min: 0,
      max: 100,
      url: "https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/Badges%2FBeginner%2FBeginner.png?alt=media&token=8bec5e34-39c6-402c-b8e0-954d4845baf6",
    },
  ];

  for (const range of ranges) {
    if (profileScore >= range.min && profileScore < range.max) {
      return range.url;
    }
  }

  // Default URL for any score not covered in ranges
  return "default_url";
};

export { getBadgeData, getProfileBadgeData };
