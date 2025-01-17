<script>
	import { onMount } from 'svelte';
	import Image from '../../lib/assets/images/bolsas.jpg';

	/** @type {HTMLImageElement} rawImage */
	let rawImage;
	/** @type {HTMLImageElement} cropImage */
	let cropImage;
	/** @type {HTMLCanvasElement} canvas */
	let canvas;

	onMount(() => {
		import('cropperjs');
	});
</script>

<section class="h-[calc(100vh-56px)] p-7">
	<div class="flex h-1/2">
		<div class="basis-1/2 h-full">
			<cropper-canvas background class="h-full" bind:this={canvas}>
				<cropper-image
					src={Image}
					alt="Picture"
					rotatable
					scalable
					skewable
					translatable
					bind:this={rawImage}
				></cropper-image>
				<cropper-shade></cropper-shade>
				<cropper-handle action="select" hidden></cropper-handle>
				<cropper-selection initial-coverage="0.5" movable resizable>
					<cropper-grid role="grid" covered></cropper-grid>
					<cropper-crosshair centered></cropper-crosshair>
					<cropper-handle action="move" theme-color="rgba(255, 255, 255, 0.35)"></cropper-handle>
					<cropper-handle action="se-resize"></cropper-handle>
					<cropper-handle action="sw-resize"></cropper-handle>
					<!--
          <cropper-handle action="n-resize"></cropper-handle>
					<cropper-handle action="e-resize"></cropper-handle>
					<cropper-handle action="s-resize"></cropper-handle>
					<cropper-handle action="w-resize"></cropper-handle>
					<cropper-handle action="ne-resize"></cropper-handle>
					<cropper-handle action="nw-resize"></cropper-handle>
					<cropper-handle action="se-resize"></cropper-handle>
					<cropper-handle action="sw-resize"></cropper-handle>
-->
				</cropper-selection>
			</cropper-canvas>
		</div>
		<div class="basis-1/2 h-full">
			<img alt="" bind:this={cropImage} />
		</div>
	</div>
</section>
