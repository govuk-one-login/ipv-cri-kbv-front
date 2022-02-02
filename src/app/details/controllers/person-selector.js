const BaseController = require("hmpo-form-wizard").Controller;

class PersonSelectorController extends BaseController {
  locals(req, res, callback) {
    super.locals(req, res, (err, locals) => {
      callback(null, locals);
    });
  }

  async saveValues(req, res, next) {
    super.saveValues(req, res, async () => {
      const selectedOption = req.body.preConfiguredValues;
      const preConfiguredValue = preConfiguredData[selectedOption];

      // aged DOB is calculated by taking (today - date of entry + date of birth).
      const today = new Date();
      const dateOfEntry = new Date(preConfiguredValue.dateOfEntry);
      const dateOfBirth = new Date(preConfiguredValue.fixedDoB);

      const agedDateOfBirth =
        today.getTime() - dateOfEntry.getTime() + dateOfBirth.getTime();
      const formattedDataOfBirth = new Date(agedDateOfBirth)
        .toISOString()
        .split("T")[0];

      req.sessionModel.set("dateOfBirth", formattedDataOfBirth);
      req.sessionModel.set("givenNames", preConfiguredValue.firstName);
      req.sessionModel.set("surname", preConfiguredValue.surname);
      req.sessionModel.set("title", preConfiguredValue.title);
      req.sessionModel.set(
        "houseNameNumber",
        preConfiguredValue.addresses[0].houseNameNumber
      );
      req.sessionModel.set(
        "streetName",
        preConfiguredValue.addresses[0].street
      );
      req.sessionModel.set(
        "townCity",
        preConfiguredValue.addresses[0].townCity
      );
      req.sessionModel.set(
        "postCode",
        preConfiguredValue.addresses[0].postcode
      );

      super.saveValues(req, res, next);
    });
  }
}

const preConfiguredData = {
  arkilAlbert: {
    firstName: "albert",
    surname: "arkil",
    title: "mr",
    addresses: [
      {
        addressType: "CURRENT",
        street: "Stocks Hill",
        townCity: "Workingham",
        houseNameNumber: 3,
        postcode: "CA14 5PH",
      },
    ],
    dateOfEntry: "2017-03-24",
    fixedDoB: "1943-10-05",
  },
  duffLinda: {
    firstName: "Linda",
    surname: "Duff",
    title: "Miss",
    addresses: [
      {
        addressType: "CURRENT",
        street: "Hand Avenue",
        townCity: "Leicester",
        houseNameNumber: 198,
        postcode: "LE3 1SL",
      },
    ],
    dateOfEntry: "2017-03-24",
    fixedDoB: "1986-01-20",
  },
  decerqueiraKenneth: {
    firstName: "Kenneth",
    surname: "decerqueira",
    title: "MR",
    addresses: [
      {
        addressType: "CURRENT",
        street: "Hadley Road",
        townCity: "Bath",
        houseNameNumber: "8",
        postcode: "BA2 5AA",
      },
    ],
    dateOfEntry: "2017-03-24",
    fixedDoB: "1959-08-23",
  },
};

module.exports = PersonSelectorController;
