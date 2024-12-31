<script lang="ts">
  const {
    name,
    link,
    image,
  }: {
    name: string;
    link?: string;
    image?: string;
  } = $props();
</script>

{#if image}
  <img
    src={image}
    alt={name}
    style:max-height="3em"
    style:vertical-align="middle"
  />
{/if}
{#if link}
  <a href={link}>{name}</a>
{:else}
  <span>{name}</span>
{/if}
