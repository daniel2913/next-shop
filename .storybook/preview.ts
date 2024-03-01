import type { Preview } from '@storybook/react'
import "../src/app/global.css"
import {withConsole} from "@storybook/addon-console"
import { Providers } from './decorators';
import {ToastState,ToastDecorator} from "../src/__mocks__/useToastStore"
import {ModalState,ModalDecorator} from "../src/__mocks__/useModalStore"

const preview: Preview = {
	decorators:[
		ModalDecorator,
	],
	args:{
		ModalState,
	},
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
			 open: /open/i
      },
    },
		
  },
};

export default preview;
