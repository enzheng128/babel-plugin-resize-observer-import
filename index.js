const resizeObserverImport = ({ types: t }) => {
  return {
    visitor: {
      NewExpression(path, state) {
        // 检测是否使用了 new ResizeObserver
        if (
          t.isIdentifier(path.node.callee) &&
          path.node.callee.name === 'ResizeObserver'
        ) {
          state.isImported = true;
        }
      },
      ImportDeclaration(path, state) {
        if (path.node.source.value === 'resize-observer-polyfill') {
          state.alreadyImported = true;
        }
      },
      Program: {
        exit(path, state) {
          // 如果使用了 new ResizeObserver，且还没有引入 'resize-observer-polyfill'
          if (state.isImported && !state.alreadyImported) {
            const importDeclaration = t.importDeclaration(
              [t.importDefaultSpecifier(t.identifier('ResizeObserver'))],
              t.stringLiteral('resize-observer-polyfill')
            );

            // 在代码顶部添加 import 语句
            path.unshiftContainer('body', importDeclaration);
          }
        },
      },
    },
  };
};

module.exports = resizeObserverImport;
