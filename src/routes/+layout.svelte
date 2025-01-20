<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>
<div class="flex items-center py-16 justify-center min-h-screen">
	{@render children()}
</div>
