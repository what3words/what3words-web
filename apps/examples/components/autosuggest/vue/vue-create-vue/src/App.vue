<script setup>
import Autosuggest from "./components/Autosuggest.vue";
</script>

<template>
  <main>
    <h2>what3words Autosuggest Component - Vue Create-Vue</h2>
    <form method="POST">
      <div className="form-container">
        <Autosuggest></Autosuggest>
      </div>
      <button type="submit" data-testid="submit">Complete</button>
    </form>
  </main>
</template>

<style scoped></style>
