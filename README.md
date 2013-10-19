# In-browser javascript kernel

To run a javascript kernel in-browser instead of remote via websockets,
just clone this repo into your IPython directory :

```bash
cd $(ipython locate)
git clone minrk/profile_jskernel
```
```
Cloning into 'profile_jskernel'...
remote: Counting objects: 11, done.
remote: Compressing objects: 100% (8/8), done.
remote: Total 11 (delta 0), reused 11 (delta 0)
Unpacking objects: 100% (11/11), done.
```

You should now be able to start IPython Notebook with in-browser js kernel with:

```bash
ipython notebook --profile jskernel
```
