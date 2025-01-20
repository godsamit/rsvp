<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>
<div class="flex bg-gray-200 justify-center min-h-screen">
	{@render children()}
</div>
