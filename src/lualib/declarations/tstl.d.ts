/** @noSelfInFile */

/** @vararg */
type Vararg<T extends unknown[]> = T & { __luaVararg?: never };

interface Metatable {
    _descriptors?: Record<string, PropertyDescriptor>;
    __index?: any;
    __newindex?: any;
    __tostring?: any;
}

interface LuaClass extends Metatable {
    prototype: LuaClassInstance;
    [Symbol.hasInstance]?(instance: LuaClassInstance): any;
    ____super?: LuaClass;
}

interface LuaClassInstance extends Metatable {
    constructor: LuaClass;
}
