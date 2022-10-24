module.exports = {
  noneOfTheAbove: {
    key: "answers.noneOfTheAbove",
    regexp: new RegExp("^NONE OF THE ABOVE / DOES NOT APPLY$", "g"),
  },
  upToMonths: {
    key: "answers.upToMonths",
    regexp: /UP TO (?<months>[0-9,]+) MONTHS/,
  },
  overUpToMonths: {
    key: "answers.overUpToMonths",
    regexp:
      /OVER (?<months_low>[0-9,]+) MONTHS UP TO (?<months_high>[0-9,]+) MONTHS/,
  },
  upToAmount: {
    key: "answers.upToAmount",
    regexp: /^UP TO £(?<amount>[0-9,]+)$/,
  },
  overUpToAmount: {
    key: "answers.overUpToAmount",
    regexp: /OVER £(?<amount_low>[0-9,]+) UP TO £(?<amount_high>[0-9,]+)/,
  },
};
