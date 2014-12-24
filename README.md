# In-browser javascript kernel for Jupyter

To run a javascript kernel in-browser instead of remote via websockets,
just clone this repo into your IPython kernels directory:

```bash
cd $(ipython locate)/kernels
git clone https://github.com/minrk/jskernel
```

```
Cloning into 'jskernel'...
remote: Counting objects: 11, done.
remote: Compressing objects: 100% (8/8), done.
remote: Total 11 (delta 0), reused 11 (delta 0)
Unpacking objects: 100% (11/11), done.
```

You should now be able to select 'Javascript' from the kernel selection drop-down.

Requires IPython ≥ 3.
