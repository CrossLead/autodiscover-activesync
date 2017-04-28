## autodiscover-activesync

[![Build Status](https://travis-ci.org/CrossLead/autodiscover-activesync?branch=master)](https://travis-ci.org/CrossLead/autodiscover-activesync)

### Overview

#### Usage Notes

This library uses the process outlined [https://msdn.microsoft.com/en-us/library/office/jj900169(v=exchg.150).aspx](https://msdn.microsoft.com/en-us/library/office/jj900169(v=exchg.150).aspx) and [https://msdn.microsoft.com/en-us/library/office/hh352638(v=exchg.140).aspx](https://msdn.microsoft.com/en-us/library/office/hh352638(v=exchg.140).aspx) to try and determine automatically what the Active Sync url is for the given user.

### Installation

##### npm
```shell
npm install --save autodiscover-activesync
```


### Usage

```javascript

import { autodiscover } from 'autodiscover-activesync';

const url = autodiscover({
  username : 'youremail@yourdomain.com',
  emailAddress : 'youremail@yourdomain.com',
  password: 'yourpassword',
  debug: true // if you want to inspect what it is checking
});

console.log('ActiveSync URL', url);
```
