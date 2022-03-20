<template>
  <div id="nav">
    <ul class="nav">
      <li class="nav-item px-2">
        <router-link to="/imports" class="nav-link py-2 px-3">
          Import hosts
        </router-link>
      </li>
      <li class="nav-item px-2">
        <router-link to="/entities" class="nav-link py-2 px-3">
          Exported entities
        </router-link>
      </li>
    </ul>
  </div>
  <router-view />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #ff6e0b;
  border-radius: 5px 5px 0px 0px;
}

#nav a.router-link-exact-active {
  color: white;
  background-color: #ff6e0b;
}
.nav {
  border-bottom: 1px solid #ff6e0b;
}
</style>
