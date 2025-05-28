import { ApplicationMenuLink, ProfileConfig } from '@govflanders/vl-widget-global-header-types';

/**
 * Configuration to inject an ACM component
 */
export interface NgxAcmComponentInjectionConfiguration<
	ConfigurationType extends NgxAcmComponentConfiguration = NgxAcmComponentConfiguration,
> {
	/**
	 * The selector of the element where the component should be mounted.
	 */
	selector: string;
	/**
	 * The configuration of the component
	 */
	configuration: ConfigurationType;
	/**
	 * An optional list of links we want to display in the components
	 */
	links?: ApplicationMenuLink[];
}
/**
 * The configuration of the component
 */
export interface NgxAcmComponentConfiguration {
	/**
	 * The URL of the widget (e.g. 'https://<environment>.widgets.burgerprofiel.vlaanderen.be/')
	 */
	url: string;
	/**
	 * The id of the widget (e.g. '7502b557-5d49-4ab3-9995-168718b81be5')
	 */
	id: string;
}

/**
 * The configuration of the Global Header component
 */
export interface NgxAcmHeaderComponentConfiguration extends NgxAcmComponentConfiguration {
	/**
	 * The profile configuration object
	 */
	profile: ProfileConfig;
}
