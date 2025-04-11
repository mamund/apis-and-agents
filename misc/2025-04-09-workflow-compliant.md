### Designing Workflow-Compliant Services
A shared goal of many service interface designers is the ability to easily connect multiple services to form a workflow. These are often called _composable_ services. This recipe describes a set of basic design features every workflow-compliant (composable) service should have.

#### Problem
What does it take to design a workflow-compliant service? What are the key features every composable service interface shares? How can you make it safe, cheap, and easy to implement workflow using these composable services?

#### Solution
The key to designing workflow-compliant services is to offer a consistent set of actions and make it easy to share state data among services. These elements—shared actions and shared state—are at the heart of stable, composable service interfaces.

In addition to a shared set of actions and state data, workflow-compliant services support shared identifiers for the job (as `correlation-id`) and as each task within the workflow job (as `request-id`).

##### Workflow actions
In hypermedia-driven services, actions are expressed at input forms. Each form describes all that is needed to complete the action: the URL, the HTTP method, the supported media types, and the complete set of inputs. 

While actions can be very specific (e.g., `onboardCustomer`, `computeSalesTax`, etc.), they can also be generic (`writeRecord`, `filterData`, etc.), but they _must_ be completely described with all the inputs and related HTTP metadata included (see the "Example" section).

The list of actions also needs to support the following:

* Execute:: The actual work to be done (e.g., `applySalesTax`).
* Repeat:: Repeat the work again in an idempotent manner (e.g., `applySalesTax` can be safely repeated and still be the same expected results).
* Revert:: The ability to undo a completed action (e.g., `revertSalesTax`).
* Continue:: The ability to stop a workflow and then, after some pause, continue where you left off to complete the work.
* Rerun:: The ability to start from the beginning of a set of tasks in a workflow and rerun all the steps even if the workflow has been run before.

It is a good idea for all workflow-compliant services to support all these actions, even if the action doesn't "do anything" (e.g., no support for Revert). That will make supporting them easier over time.

All these actions _should_ have an associated URL and an associated FORM. The first three actions apply to each step (referred to here as a _task_) within a workflow. The last two items apply to the complete set of tasks (called a _job_).

##### Shared state
Two other actions that are needed for workflow-compliant service interfaces are:

ReadState:: The ability to load up related state properties for use by each _task_ in the _job_.
WriteState:: The ability to store the related state properties for use by other _tasks_ within the same _job_.

Both actions need an associated URL that points to a shared HTTP resource. This resource URL should be passed to each _task_ in the workflow. It is up to each service to know how to recognize state values in the state resource and, when needed, update existing properties or add new properties to the state resource. Often, the properties in this resource are used to fill in the FORMS exposed by the composable service's actions.

##### Correlation IDs for tasks and jobs
Each workflow job and each task within that job needs unique identifiers, typically a UUID or some other globally unique value. The `jobID` value should be used as the correlation identifier. This can be passed in the HTTP `correlation-id` header. The `taskID` value should be used as the request identifier. This can be passed in the HTTP `request-id` header. Like the `correlation-id`, the `request-id` should be included in both the HTTP request and the HTTP response.

**WARNING** : The `correlation-id` and `requestid` headers are not standard, registered header values. Your organization might use some other header values or possibly even a different way to properly track workflow jobs and tasks. Whatever your organization does, the key to success is consistency and good documentation.

Workflow-compliant services support both `correlation-id` for the job and `request-id` for each task in the job.

#### Example
Consider a composable service that computes sales taxes for a shopping cart of goods. This service (along with other workflow-compliant services) can be used as a task in a job to handle checking out from a shopping site. The following is an imaginary DSL example of what that might look like:

```
*** Checkout Job

READ sharedState WITH urlState
EXECUTE shoppingCartService->checkOutForm WITH sharedSTATE
IF-NOT-OK EXIT
EXECUTE salesTaxService->applyTaxesForm WITH sharedSTATE
IF-NOT-OK EXECUTE shoppingCartService->revertCheckoutForm WITH sharedSTATE
STORE sharedState WITH urlState
EXIT

*** End Job
```

In this example, the `sharedState` is loaded into the client application. That application then attempts to execute the `shoppingCartService->checkOutForm` and the `salesTaxService->applyTaxesForm`, and then store the resulting `sharedState`. Note the support for the `shoppingCartService->revertCheckoutForm` in case something goes wrong when applying the sales taxes.


#### Discussion
Any service interface that offers an action that writes data to the shared state _should_ offer a way to reverse that action. This may be as simple as restoring the old values in the shared state resources (as in our `applySalesTax` example) or as complex as launching another job to undo some set of steps related to the action that needs to be reversed. 

Service interfaces for each task _should_ support calls to Repeat  and Revert  even if the Execute action has not yet been called. For example, calls to Revert _should not_ result in an error (unless the actual revert action experiences a problem). This means services should "know" whether the Execute  action has been previously completed. If yes, the calls to Revert will likely require some processing. If the Execute  action was not yet completed, calls to Revert  should just return `200 OK` without any processing. Think of Revert  like a `DELETE` action. Deleting an already-removed resource doesn't create any new problems, so a return of `200 OK` is an acceptable response. 

If any task  fails or times out (e.g., reaches `taskMaxTTL`), the _job_ is invalid and the Cancel action should be called. This should result in a call to Revert  all the tasks in the job. This vastly simplifies implementing cross-service rollbacks or undo.

Support for the Repeat  of an action should be easy to handle since (as discussed in <<design-idempotent>>) all service actions should be idempotent. If you find you're having trouble safely repeating an action, you probably have a nonidempotency problem to untangle#.

Support for shared state means that each job has a state document that is passed between tasks within the job. It might seem like a better idea to use a database record for shared state, but it is not. Shared state should be supported as a standalone HTTP resource that supports idempotent updates and possibly varying representation media types. This is the only set of properties that should be shared between services in a job. 

If there are many steps in a job (some of which might take lots of time), and that job gets stopped for some reason (e.g., problems with one of the tasks that needs to be fixed by a person), then the ability to Continue where the job left off is very useful. It can save time and computing resources. 

Support for the Rerun action is handy when you want to force-restart a job that has multiple tasks. For example, you might find that after running a job, you notice that the results are not quite what you expected. You might be able to fix some state information and then rerun the complete job to get the proper results.

Although not covered here, you can create job _templates_ where the tasks are the same but the contents of the shared state resource vary. This makes it possible to quickly define and run jobs based on configuration data (via the shared state resource). If you plan to do a lot of this kind of work, see <<workflow-jobs>> for an example of a generic RESTful job control language that makes defining and running jobs easier.
