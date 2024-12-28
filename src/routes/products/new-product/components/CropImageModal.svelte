<script>
	import { onMount } from 'svelte';

	export let dialog;
	export let imageElement;

	onMount(async () => {
		await import('cropperjs');
	});
</script>

<dialog id="cropImageModal" class="modal" bind:this={dialog}>
	<div class="modal-box h-5/6 w-4/6 max-w-none rounded bg-white">
		<cropper-canvas background class="w-full h-/6">
			<cropper-image alt="Picture" rotatable scalable skewable translatable bind:this={imageElement}
			></cropper-image>
			<cropper-shade hidden></cropper-shade>
			<cropper-handle action="select" plain></cropper-handle>
			<cropper-selection initial-coverage="0.5" movable resizable>
				<cropper-grid role="grid" covered></cropper-grid>
				<cropper-crosshair centered></cropper-crosshair>
				<cropper-handle action="move" theme-color="rgba(255, 255, 255, 0.35)"></cropper-handle>
				<cropper-handle action="n-resize"></cropper-handle>
				<cropper-handle action="e-resize"></cropper-handle>
				<cropper-handle action="s-resize"></cropper-handle>
				<cropper-handle action="w-resize"></cropper-handle>
				<cropper-handle action="ne-resize"></cropper-handle>
				<cropper-handle action="nw-resize"></cropper-handle>
				<cropper-handle action="se-resize"></cropper-handle>
				<cropper-handle action="sw-resize"></cropper-handle>
			</cropper-selection>
		</cropper-canvas>
	</div>
</dialog>
