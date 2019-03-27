export default function (Vue) {
  const version = Number(Vue.version.split('.')[0])
  //判断vue的版本号 如果vue1.0Vuex会将vuexInit方法放入Vue的_init方法中，
  //而对于Vue2.0，则会将vuexinit混淆进Vue的beforeCreacte钩子中。来看一下vuexInit的代码

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    const _init = Vue.prototype._init
    Vue.prototype._init = function (options = {}) {
      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit
      _init.call(this, options)
    }
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */
//从传入的options中获取store 如果是根节点则直接获取
//如果是子节点则通过options中的parent获取
  function vuexInit () {
    const options = this.$options
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
}
