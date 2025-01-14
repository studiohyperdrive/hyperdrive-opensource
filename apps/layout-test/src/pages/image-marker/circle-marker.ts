import { EllipseMarker, IPoint, SvgHelper } from 'markerjs2';
import { EllipseMarker as EllipseViewMarker } from 'markerjs-live';

export class CircleMarker extends EllipseMarker {
	/**
	 * Marker type title (display name) used for accessibility and other attributes.
	 */
	public static title = 'Circle';

	protected createVisual(): void {
		this.visual = SvgHelper.createCircle(10, [
			['fill', this.fillColor],
			['stroke', this.strokeColor],
			['stroke-width', this.strokeWidth.toString()],
			['stroke-dasharray', this.strokeDasharray],
			['opacity', this.opacity.toString()],
		]);

		this.addMarkerVisualToContainer(this.visual);
	}

	public pointerDown(point: IPoint, target?: EventTarget): void {
		super.pointerDown(point, target);

		if (this.state === 'new') {
			this.createVisual();

			this.moveVisual({
				x: point.x + 100,
				y: point.y + 10,
			});

			this._state = 'creating';
		}
	}
}

export class CircleViewMarker extends EllipseViewMarker {
	/**
	 * Marker type title (display name) used for accessibility and other attributes.
	 */
	public static title = 'Circle';

	protected createVisual(): void {
		this.visual = SvgHelper.createCircle(10, [
			['fill', this.fillColor],
			['stroke', this.strokeColor],
			['stroke-width', this.strokeWidth.toString()],
			['stroke-dasharray', this.strokeDasharray],
			['opacity', this.opacity.toString()],
		]);
		this.addMarkerVisualToContainer(this.visual);
	}
}
