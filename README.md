# bookeeper
This website is a cloud based financing app that supports adding/paying employees, adding/purchasing from vendors, adding/invoicing customers, and generating income statement and balance sheet.

## Testing
Demo add/pay employee
https://drive.google.com/file/d/1HYjhCer4MzZAMSUSYR9VqZZ6WaUsOSxp/view?usp=sharing

Demo add/purchase from vendor, and invoice customer
https://drive.google.com/file/d/1MQf8mpdsD9FIFgJi0eeGhj1Ll0tjTpQq/view?usp=sharing

Login combo is needed to view and modify data.

## assumptions
The app is intended for one company to use, a company that builds bottles from glass and plastic. Assumptions are kept in /bookkeeper_web/src/utils/constants.ts. Please use that as the source of truth. At the time of writing this README, the assumptions are as follows:

* 3 units of glass + 2 units of plastic = 1 unit of bottle
* glass: $50/unit
* plastic: $10/unit
* bottle: $200/unit
* cost per of manufacturing a bottle: $170
* withholding rate: 25%
* income tax rate: 30%
* cash to start with: $15000
* bills: $5000
* annual expenses: $2000
