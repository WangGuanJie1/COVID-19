  // TODO:所有方法存在超多Bug，校验还需更多细致优化,可读性极差待后期完善

  let defaultConfig = {
      dbName: '',
      version: 1,
      // storeList: [],
      // addTransaction: {
      //     objectStore: '',
      // },
      // deleteTransaction: {
      //     objectStore: '',
      // },
      // readTransaction: {
      //     objectStore: '',
      // }
  };

  /**
   * 合并配置信息
   * 
   * @param {Object} config 
   * 
   * @returns {Object} 完善后的配置信息
   */
  function configMerge(config) {
      let conf = JSON.parse(JSON.stringify(defaultConfig));
      Object.assign(conf, config);
      conf['version'] = conf['version'] || 1;
      return conf;
  }

  /**
   * 校验对象仓库是否存在
   * 
   * @param {Object} config 参数配置信息
   * @param {String} storeName 对象仓库名
   * @param {Function} cr 回调函数 
   */
  export function storeExists(config, storeName, cr) {
      let conf = configMerge(config);
      let request = create(conf);

      request.onsuccess = function(evt) {
          let db = evt.target.result;
          if (db.objectStoreNames.contains(storeName)) {
              cr(true);
          } else {
              cr(false);
          }
      }

      request.onerror = function(evt) {}
  }

  /**
   * 创建或打开IBD数据库
   * 
   * @param {Object} 数据库配置信息
   * 
   * @returns {Object} IDB数据库对象
   */
  export function create(config) {
      let conf = configMerge(config);
      let request = window.indexedDB.open(conf['dbName'], conf['version']);

      request.onerror = function(evt) {}

      request.onsuccess = function(evt) {}

      request.onupgradeneeded = function(evt) {
          let db = evt.target.result;
          for (const item in conf['storeList']) {
              let store = conf['storeList'][item];
              if (!db.objectStoreNames.contains(store['storeName'])) {
                  if (store['isInc']) {
                      db.createObjectStore(store['storeName'], { autoIncrement: true });
                  } else {
                      db.createObjectStore(store['storeName'], { keyPath: store['keyPathName'] });
                  }
              }
          }
      }
      return request;
  }

  /**
   * 删除IDB数据库
   * 
   * @param {String} dbName 数据库名称
   */
  export function deleteDB(dbName) {
      let request = window.indexedDB.deleteDatabase(dbName);

      request.onsuccess = function(evt) {}

      request.onerror = function(evt) {}
  }

  /**
   * 新增数据
   * 
   * @param {Object} config 添加配置信息
   * @param {Array} data 添加的数据
   */
  export function add(config, data) {
      let action = function(exists) {
          let conf = configMerge(config);
          let request = create(conf);

          if (exists) {
              request.onerror = function(evt) {}

              request.onsuccess = function(evt) {
                  let db = evt.target.result;
                  let transaction = db
                      .transaction(conf['addTransaction']['objectStore'], 'readwrite')
                      .objectStore(conf['addTransaction']['objectStore'])
                      .add(data);

                  transaction.onsuccess = function(evt) {}

                  transaction.onerror = function(evt) {}
              }
          } else {}
      }
      storeExists(config, config['addTransaction']['objectStore'], action);
  }

  /**
   * 删除数据
   * 
   * @param {Object} config 删除配置信息
   */
  export function remove(config) {
      if (!(config['deleteTransaction']['delete'] || config['deleteTransaction']['deleteAll'] === true)) {
          return false;
      }

      let action = function(exists) {
          let conf = configMerge(config);
          let request = create(conf);

          if (exists) {
              request.onerror = function(evt) {}

              request.onsuccess = function(evt) {
                  let db = evt.target.result;
                  let objectStore = db
                      .transaction(conf['deleteTransaction']['objectStore'], 'readwrite')
                      .objectStore(conf['deleteTransaction']['objectStore']);
                  if (conf['deleteTransaction']['deleteAll'] === true) {
                      objectStore
                          .openCursor()
                          .onsuccess = function(evt) {
                              let cursor = evt.target.result;
                              if (cursor) {
                                  objectStore.delete(cursor.key);
                                  cursor.continue();
                              } else {

                              }
                          };
                  } else {
                      let transaction = null;
                      transaction = objectStore.delete(conf['deleteTransaction']['delete']);

                      transaction.onsuccess = function(evt) {}

                      transaction.onerror = function(evt) {}
                  }
              }
          } else {}
      }
      storeExists(config, config['deleteTransaction']['objectStore'], action);

  }


  /**
   * 读取数据
   * 
   * @param {Object} config 读取配置信息 
   */
  export function read(config) {
      return new Promise((resolve, reject) => {
          if (!(config['readTransaction']['read'] || config['readTransaction']['readAll'] === true)) {
              return false;
          }

          let action = function(exists) {
              let conf = configMerge(config);
              let request = create(conf);

              if (exists) {
                  request.onerror = function(evt) {}

                  request.onsuccess = function(evt) {
                      let db = evt.target.result;
                      let objectStore = db
                          .transaction(conf['readTransaction']['objectStore'], 'readonly')
                          .objectStore(conf['readTransaction']['objectStore']);
                      if (conf['readTransaction']['readAll'] === true) {
                          let data = [];
                          objectStore
                              .openCursor()
                              .onsuccess = function(evt) {
                                  let cursor = evt.target.result;
                                  if (cursor) {
                                      console.log(objectStore)
                                      objectStore.get(cursor.key).onsuccess = function(evt) {
                                          data.push(evt.target.result);
                                          // console.log(evt.target.result);
                                      };
                                      cursor.continue();
                                  } else {
                                      console.log(data);
                                      resolve(data);
                                  }
                              };
                      } else {
                          let transaction = null;
                          transaction = objectStore.get(conf['readTransaction']['read']);

                          transaction.onsuccess = function(evt) {
                              // console.log(evt.target.result)
                              resolve(evt.target.result);
                              return evt.target.result;
                          }

                          transaction.onerror = function(evt) {}
                      }
                  }
              } else {}
          }
          storeExists(config, config['readTransaction']['objectStore'], action);
      });
  }