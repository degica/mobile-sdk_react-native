## Development workflow

### Running the example app

- Install the dependencies
  - `yarn install`
- For ios
  - Go to the `example/ios` folder
  - `pod install`
  - Go back to the example folder `cd ..`
  - `yarn ios`
- For Android
  - Go to the `example` folder
  - `yarn android`

## Release flow
- Login to your npm account if you are not already logged in
  - `npm login`
- Transpile the source code
  - `yarn prepare`
- Start release 
  - `yarn release`
  - answer the questions and press enter
