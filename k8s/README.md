# k8s

## Argo Events

getting started with argo events https://argoproj.github.io/argo-events/quick_start/

## ArgoCD (experimental)

### Create namespace 

First, you need to create namespace by running `kubectl create namespace argocd` and switch to that namespace

### Add ArgoCD repo

you need to add the ArgoCD Helm repository to your Helm repositories list. Run the following commands:
```shell
helm repo add argo https://argoproj.github.io/argo-helm
helm repo update
```

### Install ArgoCD using Helm

Next, you can install ArgoCD using Helm with the following command:
```shell
helm install argocd argo/argo-cd
```

### Accessing the ArgoCD UI

Once the installation is complete, you can access the ArgoCD UI by port-forwarding the ArgoCD server service:
```shell
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Then, open a browser and navigate to https://localhost:8080.

### Login to ArgoCD UI

When you access the ArgoCD UI for the first time, you will need to log in. The default username is admin and the password can be obtained by running:
```shell
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```


### IMPORTANT NOTE

login to argo server with the default password doesn't work, there is an [open issue](https://github.com/argoproj/argo-cd/issues/10708) in argocd repo


To solve this for now, execute to argocd server pod
```shell
kubectl exec -it svc/argocd-server -- bash 
```

Generating a bcrypt hash
```shell
argocd account bcrypt --password <YOUR-PASSWORD-HERE>
```

Apply the new password hash, use the following command (replacing the hash with your own)
```shell
# bcrypt(password)=$2a$10$rRyBsGSHK6.uc8fntPwVIuLVHgsAhAX7TcdrqW/RADU0uh7CaChLa
kubectl -n argocd patch secret argocd-secret \
  -p '{"stringData": {
    "admin.password": "$2a$10$rRyBsGSHK6.uc8fntPwVIuLVHgsAhAX7TcdrqW/RADU0uh7CaChLa",
    "admin.passwordMtime": "'$(date +%FT%T%Z)'"
  }}'
```
For more details go to [faq.md](https://github.com/argoproj/argo-cd/blob/master/docs/faq.md#i-forgot-the-admin-password-how-do-i-reset-it)


## Postgres

### Create namespace 

First, you need to create namespace by running `kubectl create namespace pg` and switch to that namespace

### Add Postgres repo

First, you need to add the Postgres Helm repository to your Helm repositories list. Run the following commands:
```shell
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
```

### Install PostgreSQL using Helm:

Now you can use Helm to install PostgreSQL with the configuration options you specified in your values.yaml file:
```shell
helm install postgres bitnami/postgresql -f k8s/pg/values.yaml
```

### Connect to postgres:

To get the password for "postgres" run:
```shell
export POSTGRES_ADMIN_PASSWORD=$(kubectl get secret --namespace pg postgres-postgresql -o jsonpath="{.data.postgres-password}" | base64 -d)
```

To get the password for "nats_uptime_bot" run:
```shell
export POSTGRES_PASSWORD=$(kubectl get secret --namespace pg postgres-postgresql -o jsonpath="{.data.password}" | base64 -d)
```

To connect to your database run the following command:
```shell
    kubectl run postgres-postgresql-client --rm --tty -i --restart='Never' --namespace pg --image docker.io/bitnami/postgresql:16.2.0-debian-11-r1 --env="PGPASSWORD=$POSTGRES_PASSWORD" \
      --command -- psql --host postgres-postgresql -U nats_uptime_bot -d nats_uptime_bot -p 5432
```

## NATS with JetStream

follow this link https://github.com/nats-io/k8s/tree/main/helm/charts/nack for setting up minimal NATS with JetStream
